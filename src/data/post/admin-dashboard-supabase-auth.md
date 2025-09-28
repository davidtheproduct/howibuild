---
title: "Supabase Authentication Security: JWT vs Role-Based Access with PostgreSQL RLS"
description: "Master Supabase authentication patterns: JWT tokens vs role-based security, anonymous access, and PostgreSQL RLS policies. Complete implementation guide with security best practices."
publishDate: 2025-09-28T00:00:00.000Z
author: David Webb
category: build-log
tags:
  - supabase
  - authentication
  - postgresql
  - security
  - jwt
image: ~/assets/images/admin-dashboard-supabase-auth.png
---

I just shipped secure admin authentication for our Supabase application. Admin users can now CRUD (Create, Read, Update, Delete) data through a proper web interface at `/admin`.

## The Problem

Our application needed secure admin access to manage core backend data. The existing JWT-based system wasn't scalable for role-based permissions. I needed to migrate to Supabase's user roles system while maintaining security and avoiding the infinite loop traps that plague authentication systems.

### JWT vs Role-Based Authentication: What's the Difference?

Before diving into the technical details, let's review the core difference between these two approaches:

**JWT (JSON Web Token) approach:**
- The server creates a token containing user permissions when you log in
- This token is like a digital ID card with all your permissions written on it
- Every time you make a request, you show this ID card
- The server reads the permissions directly from the token

**Role-based approach:**
- The server checks what role you have in a database table
- Your permissions are determined by your role (admin, user, etc.)
- The database itself enforces these rules using Row-Level Security
- More flexible and secure, but requires database queries

![Admin Access Comparison](~/assets/images/admin-access-comparison.png)

Both approaches work for checking admin access, but they differ in how they store and validate permissions. JWT reads from a token stored in the browser, while role-based queries the database directly.

![Security Revocation Comparison](~/assets/images/security-revocation-comparison.png)

The critical difference emerges when you need to revoke admin access. With JWT, users keep admin privileges until their token expires. With role-based authentication, you can remove admin access instantly through a database update.

This instant revocation capability makes role-based authentication essential for admin operations where security changes need immediate effect.

### Supabase Anonymous Access: The Third Option

Supabase also supports anonymous authentication for your main application:

**Anonymous access:**
- Users get a temporary account without providing personal information
- Perfect for guest browsing, trial experiences, or progressive onboarding
- Anonymous users are treated as authenticated but with an `is_anonymous` flag
- Can later upgrade to full accounts without losing data

Note: Admin interfaces should require explicit authentication - anonymous access is for your main app's user experience, not administrative functions.

### When to Choose Each Approach

**Choose JWT when:**
- Building stateless, scalable applications (microservices, APIs)
- You need offline capabilities or mobile apps
- Building public APIs where tokens can be shared

**Choose role-based when:**
- Building admin interfaces or internal tools
- You need instant permission changes without waiting for token expiration
- Complex permission hierarchies with audit trail requirements

**Choose anonymous access when:**
- Progressive onboarding (try before you buy)
- Guest experiences that need temporary state
- Testing features without requiring immediate registration

For admin CRUD operations, role-based authentication is almost always the right choice because you need immediate permission changes and comprehensive audit trails.

## The Solution Overview

- Migrated from JWT to user_roles security model
- Built admin CRUD interface with React + Supabase
- Implemented Row-Level Security (RLS) policies
- Fixed recursive policy issues and race conditions
- Moved to a more structured 'epic' approach for incremental value delivery
- Created reusable blueprint for future CRUD implementations

## Implementation Walkthrough

### Step 1: JWT to User Roles Migration

I used a collaborative approach between Claude Code and Supabase's AI assistant:
1. Generated migration scripts in Claude Code
2. Validated with Supabase's AI for database-specific feedback
3. Refined based on security recommendations
4. Repeated until edge cases were covered

**Epic structure approach**: Broke work into smaller, achievable increments rather than big-bang delivery. Each epic contained specific, numbered tasks that delivered value incrementally.

```sql
-- Example: Creating user_roles table with proper security
CREATE TABLE public.user_roles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin', 'user')), -- Add more roles as needed
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
```

### Step 2: Security Verification Process

I ran verification scripts after each migration step using Supabase's SQL editor. This caught two critical errors that would have granted admin permissions to anonymous users. Easy to fix during development, but catastrophic if deployed.

I found this easiest way to do this was copy and paste from Supabase to Cursor and ask _"Does this look right? Explain why."_

```sql
-- Verification script that caught critical issues
SELECT
  p.proname as function_name,
  r.rolname as role_name,
  has_function_privilege(r.oid, p.oid, 'EXECUTE') as can_execute
FROM pg_proc p
CROSS JOIN pg_roles r
WHERE p.proname IN ('seed_admin_user', 'has_role')
  AND r.rolname IN ('authenticated', 'anon', 'service_role')
ORDER BY p.proname, r.rolname;
```

### Step 3: CRUD Interface Development

I used GPT-5 for planning and Claude Code subagents for implementation:
- ✅ Data-Scientist Agent for SQL migrations
- ✅ TypeScript-pro Agent for React components with TypeScript
- ✅ Architect Agent for component integration

The main challenge was integrating the auth component with the admin CRUD interface. Getting them to work together required more coordination than expected.

## Issues I Hit (and Fixes)

### Issue 1: Circular Dependency Hell

**Problem**: Infinite loop between `refreshRoles` function and `useEffect` hooks.

**Root Cause**: `refreshRoles` was recreated when user changed, causing `useEffect` to re-run infinitely.

**Fix**: Fixed `refreshRoles` using `useRef` to maintain stable function reference.

```typescript
// Fixed approach
const refreshRolesRef = useRef<() => void>();
refreshRolesRef.current = useCallback(() => {
  // refresh logic
}, [user]);

const refreshRoles = useCallback(() => {
  refreshRolesRef.current?.();
}, []);
```

### Issue 2: Recursive Policy Infinite Loop

**Problem**: RLS policies created infinite loops when checking user roles.

**Root Cause**: `user_roles` query → RLS check → `user_roles` query → ∞ loop

**Fix**: Used `SECURITY DEFINER` function to bypass RLS within the function.

```sql
-- Industry-standard solution
CREATE OR REPLACE FUNCTION has_role(role_name text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles r
    WHERE r.user_id = auth.uid() AND r.role = role_name
  );
$$;
```

### Understanding SECURITY DEFINER vs INVOKER

This fix introduces an important PostgreSQL concept that's worth explaining:

**SECURITY INVOKER (default):**
- The function runs with the permissions of whoever calls it
- Like giving someone your ID card to do something on your behalf
- If they don't have permission, the function fails

**SECURITY DEFINER:**
- The function runs with the permissions of whoever created it (the "definer")
- Like having a trusted assistant who can access restricted areas on your behalf
- The function bypasses normal permission checks

In our case, `SECURITY DEFINER` allows the `has_role()` function to check the `user_roles` table even when called from within RLS policies, preventing the infinite loop. The function runs with elevated privileges but still checks the actual user's role.

**Simple decision rule**: Ask yourself: _"Do I need this function to bypass normal permission checks?"_ If yes, use `SECURITY DEFINER`. If no, use `SECURITY INVOKER` (the default).

### Issue 3: Race Condition in User State

**Problem**: `hasRole` returned false due to premature checks before user state was set.

**Root Cause**: Race condition between user state and role loading.

**Fix**: Modified loading condition to wait for user state.

```typescript
// Fixed loading condition
if (!initialized || loading || rolesLoading || (!user && initialized)) {
  return <LoadingSpinner />;
}
```

### Issue 4: PostgreSQL PUBLIC Privilege Trap

**Problem**: PostgreSQL grants `EXECUTE` to `PUBLIC` by default on all functions.

**Fix**: Always `REVOKE FROM PUBLIC` first when restricting function access.

```sql
-- CRITICAL: Must revoke from PUBLIC first
REVOKE EXECUTE ON FUNCTION seed_admin_user(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION seed_admin_user(text) FROM authenticated, anon;
```

## Results & Learnings

### What Worked
- **Systematic security review**: Collaborating with Supabase's AI assistant caught critical issues
- **Epic structure approach**: Breaking work into smaller, achievable increments instead of big-bang delivery
- **Manual verification**: Running verification scripts after each migration prevented security vulnerabilities
- **Blueprint creation**: Documented the pattern for future CRUD implementations

### Key Insights
1. **PostgreSQL security defaults are permissive**: Requires explicit restriction rather than explicit permission
2. **SECURITY DEFINER vs INVOKER**: Use DEFINER sparingly, only when bypassing RLS is needed
3. **Function ownership matters**: Ensure function owners have required table privileges
4. **Auth context awareness**: `auth.uid()` returns NULL in service_role context

### Performance Impact
- Admin CRUD operations: < 200ms response time
- Authentication checks: < 50ms
- Security verification: Comprehensive coverage of all critical paths

## Tips for Your Implementation

**Break It Down**: Do CRUD before bulk updates. Use epic structure to break large features into smaller, achievable increments.

**Measure Twice, Cut Once**: Pitch multiple models against each other but watch out for analysis paralysis.

**Understand Tool Limitations**: Supabase is a database expert but lacks business context. Constantly ask: _"Have you checked the actual database?"_, _"Is this necessary? Why/why not?"_, _"What are our options here?"_.

**Security-First Approach**:
- Design security model first, then implement functions
- Run security verification tests after each function creation
- Include `REVOKE FROM PUBLIC` for sensitive functions
- Test both positive and negative access scenarios

## Creating a Reusable Blueprint

After getting the admin CRUD working, I created a comprehensive blueprint covering database schema, TypeScript types, React Query hooks, UI components, and auth patterns.

**Key insight**: The blueprint includes audit logging, which is overkill for most applications but critical for admin operations. Tailor based on your security requirements and ask for guidance, pros/cons if in doubt.

## What's Next

With admin authentication secure, upcoming epics include bulk operations, user management, and performance improvements.

---

**Want the blueprint?** Comment below or reach out for the complete CRUD pattern template for adding a web interface on top of Supabase.

**Want to see what I'm building next?** Check out the [Coming Up page](/coming-up) to vote on what I should build next, or [get involved](/get-involved) to share how you build.