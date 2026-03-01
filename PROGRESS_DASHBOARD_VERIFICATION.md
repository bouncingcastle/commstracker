// Test/Verification: Commission Progress Dashboard Data Verification
// This file documents the expected data structure for testing

// DEMO DATA CREATED:
// URLs: http://serviceinstance/x_823178_commissio_progress.do

// SALES REPS:
// Abel Tuter: 62826bf03710200044e0bfc8bcbe5df1
// - Plan: $50,000 target for 2026
// - Earned YTD: $6,320 (2 calculations)
// - Active Deals: $120,000 pipeline

// Adela Cervantsz: 0a826bf03710200044e0bfc8bcbe5d7a  
// - Plan: $85,000 target for 2026
// - Earned YTD: $14,480 (2 calculations)
// - Active Deals: $250,000 pipeline

// COMMISSION STRUCTURES:
// Abel Calculation 1: $4,400 (8% of $55K new business)
// Abel Calculation 2: $1,920 (6% of $32K expansion)
// Adela Calculation 1: $5,680 (4% of $142K renewal)
// Adela Calculation 2: $8,800 (10% of $88K new business)

// ACTIVE DEALS (In Pipeline):
// Abel: InnovateTech Implementation - $120,000 (proposal stage)
// Adela: TechGlobal Expansion Package - $250,000 (negotiation stage)

// ADMIN FEATURES:
// - Admins (Abraham Lincoln) can search for any user by name or ID
// - Dashboard dynamically switches view to show selected user's progress
// - "Reset to Me" button returns to admin's own progress

// TO TEST:
// 1. Log in as Abel Tuter -> view My Progress (should show $6,320 earned, $50K target)
// 2. Log in as Adela Cervantsz -> view My Progress (should show $14,480 earned, $85K target)
// 3. Log in as Admin (Abraham Lincoln) -> view My Progress
//    - Should show admin selector
//    - Search for "Abel" or "Adela"
//    - Verify switching works correctly
//    - Click "Reset to Me" to return to admin view
