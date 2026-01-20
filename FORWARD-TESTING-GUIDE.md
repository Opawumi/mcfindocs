# Forward Functionality Testing Guide
## University Memo System - To, Cc, Bcc, and Reply-To Testing

### 🎓 Test Accounts Overview

All accounts created successfully! Total: **17 accounts**
**Password for all accounts:** `password123`

---

## 📋 Account List by Department

### **ADMINISTRATION**
1. **Admin** - admin@university.edu
   - Role: System Administrator
   - Department: Administration
   - Use for: Main testing account, system-wide memos

### **TOP MANAGEMENT**
2. **Vice Chancellor** - vc@university.edu
   - Prof. Sarah Johnson
   - Use for: High-level approvals, policy memos

3. **DVC (Admin)** - dvc.admin@university.edu
   - Dr. Emmanuel Okafor
   - Use for: Administrative directives, operational memos

4. **DVC (Academic)** - dvc.academic@university.edu
   - Dr. Grace Nwosu
   - Use for: Academic policy, curriculum matters

### **REGISTRY**
5. **Registrar** - registrar@university.edu
   - Mrs. Janet Akinola
   - Use for: Official correspondence, records

6. **Deputy Registrar** - deputy.registrar@university.edu
   - Mr. Daniel Eze
   - Use for: Registry operations

7. **Registry Officer** - registry.officer@university.edu
   - Ms. Fatima Bello
   - Use for: Administrative processing

### **FACULTY DEANS**
8. **Dean of Science** - dean@university.edu
   - Prof. David Ogunleye
   - Use for: Faculty-level memos

9. **Dean of Arts** - dean.arts@university.edu
   - Prof. Amina Hassan

10. **Dean of Engineering** - dean.engineering@university.edu
    - Dr. Peter Okonkwo

11. **Dean of Medicine** - dean.medicine@university.edu
    - Dr. Elizabeth Yusuf

### **DEPARTMENT HEADS**
12. **HOD Computer Science** - hod.computerscience@university.edu
    - Dr. Oluwaseun Balogun

13. **HOD Mathematics** - hod.mathematics@university.edu
    - Dr. Chioma Nduka

14. **HOD English** - hod.english@university.edu
    - Dr. Ibrahim Ahmed

### **FINANCE & BURSARY**
15. **Bursar** - bursar@university.edu
    - Mr. Christopher Adu
    - Use for: Financial approvals, budget discussions

16. **Finance Officer** - finance.officer@university.edu
    - Mrs. Blessing Okoro

### **LIBRARY**
17. **University Librarian** - librarian@university.edu
    - Dr. Ahmed Suleiman

---

## 🧪 Testing Scenarios for Forward Functionality

### **TEST SCENARIO 1: Simple Administrative Directive**
**Login as:** `admin@university.edu`

1. Navigate to a memo in your dashboard
2. Click the **Forward** button
3. Configure:
   - **To:** `registrar@university.edu` (Main recipient - takes action)
   - **Cc:** Leave empty
   - **Bcc:** Leave empty
   - **Reply-To:** Leave empty
4. Add forwarding notes: "Please process this urgently"
5. Click **Forward Memo**

**Expected Result:** Registrar receives memo and can view it in their dashboard

---

### **TEST SCENARIO 2: Multi-Recipient Academic Directive**
**Login as:** `dvc.academic@university.edu`

1. Forward a memo with:
   - **To:** 
     - `dean@university.edu` (Dean of Science)
     - `dean.arts@university.edu` (Dean of Arts)
   - **Cc:** 
     - `registrar@university.edu` (For information)
   - **Bcc:** Leave empty
   - **Reply-To:** Leave empty
2. Add notes: "Please review and provide feedback by Friday"

**Expected Result:** 
- Both Deans see the memo as "To" recipients
- Registrar sees it as "Cc" (informational only)
- All three can view the memo

---

### **TEST SCENARIO 3: Confidential High-Level Directive**
**Login as:** `vc@university.edu`

1. Forward a memo with:
   - **To:** `bursar@university.edu` (Main recipient)
   - **Cc:** `finance.officer@university.edu` (Keep informed)
   - **Bcc:** 
     - `admin@university.edu` (Discreet monitoring)
     - `dvc.admin@university.edu` (Awareness without visibility)
   - **Reply-To:** `vc@university.edu`
2. Add notes: "Urgent: Process by end of day"

**Expected Result:**
- Bursar sees: To=Bursar, Cc=Finance Officer (cannot see Bcc)
- Finance Officer sees: To=Bursar, Cc=Finance Officer (cannot see Bcc)
- Admin sees: To=Bursar, Cc=Finance Officer, **Bcc=visible** (only to themselves)
- DVC Admin sees: To=Bursar, Cc=Finance Officer, **Bcc=visible** (only to themselves)

---

### **TEST SCENARIO 4: Department Chain with Reply-To**
**Login as:** `dean@university.edu`

1. Forward a memo with:
   - **To:** `hod.computerscience@university.edu`
   - **Cc:** 
     - `hod.mathematics@university.edu`
     - `registry.officer@university.edu`
   - **Bcc:** Leave empty
   - **Reply-To:** `registry@university.edu` (Central collection point)
2. Add notes: "Please submit your responses to the Registry, not to me directly"

**Expected Result:**
- HOD Computer Science receives as main recipient
- Other HODs receive as Cc
- All recipients see "Reply-To: registry@university.edu" prominently displayed
- Any replies should conceptually go to Registry, not Dean

---

### **TEST SCENARIO 5: Complex University-Wide Circular**
**Login as:** `registrar@university.edu`

1. Forward a memo with:
   - **To:** 
     - `dean@university.edu`
     - `dean.arts@university.edu`
     - `dean.engineering@university.edu`
     - `dean.medicine@university.edu`
   - **Cc:** 
     - `dvc.academic@university.edu`
     - `deputy.registrar@university.edu`
   - **Bcc:** 
     - `vc@university.edu` (Executive awareness)
     - `bursar@university.edu` (Financial implications)
   - **Reply-To:** `registry.officer@university.edu`
2. Add notes: "Annual Academic Calendar - Please acknowledge receipt"

**Expected Result:**
- All 4 Deans see each other in "To" field
- DVC Academic and Deputy Registrar see memo as Cc
- VC and Bursar receive memo but are invisible to others
- Only VC and Bursar can see their own names in Bcc when viewing

---

## 🔍 Key Verification Points

### **1. Privacy Checks**
- [ ] Bcc recipients are NOT visible to other recipients
- [ ] Bcc recipients CAN see themselves in Bcc field
- [ ] Original sender can see all Bcc recipients in their sent items

### **2. Field Purpose Clarity**
- [ ] "To" shows tooltip: "Main Actionable Recipients"
- [ ] "Cc" shows tooltip: "Carbon Copy (Information only)"
- [ ] "Bcc" shows tooltip: "Blind Carbon Copy (Only you can see this)"
- [ ] "Reply-To" shows tooltip: "Replies should go to this address"

### **3. Dropdown Functionality**
- [ ] All 17 staff members appear in dropdowns
- [ ] Filter by department/office works correctly
- [ ] Manual email entry still works as fallback
- [ ] Multiple selections work for To, Cc, and Bcc

### **4. Display in Memo View**
- [ ] "To" recipients clearly marked
- [ ] "Cc" recipients shown (or "NA" if empty)
- [ ] "Bcc" only visible to sender and Bcc recipients
- [ ] "Reply-To" prominently displayed when set

---

## 📝 Recommended Testing Order

1. **Start Simple:** Test Scenario 1 (single recipient, no extras)
2. **Add Complexity:** Test Scenario 2 (multiple To, add Cc)
3. **Test Privacy:** Test Scenario 3 (add Bcc, verify invisibility)
4. **Test Reply-To:** Test Scenario 4 (verify Reply-To display)
5. **Full Integration:** Test Scenario 5 (use all fields together)

---

## 🚨 Common Issues to Check

1. **Bcc Leakage:** Ensure Bcc recipients never show up for non-Bcc recipients
2. **Reply-To Confusion:** Verify Reply-To is clearly distinct from "From"
3. **Empty Field Handling:** Check "NA" displays for empty Cc/Bcc fields
4. **Multi-select UI:** Ensure badges show/remove correctly
5. **Session Validation:** Each user only sees what they should see

---

## 🎯 Success Criteria

✅ All 17 accounts can log in successfully
✅ Forward dialog shows all fields (To, Cc, Bcc, Reply-To)
✅ Dropdowns populate with all staff members
✅ Manual email entry works as fallback
✅ Bcc privacy is maintained (invisible to others)
✅ Reply-To displays correctly in memo header
✅ All recipients can view forwarded memo
✅ Search includes Cc and Bcc recipients (for sender only)

---

**Ready to test? Start with Scenario 1 and work your way up!** 🚀
