# E-Senate Module - Quick Start Guide

## 🎉 What's New

The E-Senate module has been successfully integrated into your McFin Document Management System!

## 📍 How to Access

1. **From the Sidebar**: Click on "E-Senate" (graduation cap icon) in the main navigation
2. **Direct URL**: Navigate to `http://localhost:3000/dashboard/senate`

## 🖥️ User Interface

### Layout
The E-Senate page has its own sidebar with two tabs:
- **Faculty** - Manage academic faculties
- **Department** - Manage departments within faculties

### Faculty Management
**Columns:**
- # (Index number)
- Faculty Name (e.g., "Science")
- Code (e.g., "SCI")
- Dean (e.g., "Prof. Sarah Johnson")
- Actions (View, Edit, Delete buttons)

**Actions:**
- **Add Faculty** button (top right) - Opens form dialog
- **Edit** (pencil icon) - Modify faculty details
- **Delete** (trash icon) - Remove faculty (with validation)
- **View** (eye icon) - Placeholder for detail view

### Department Management
**Columns:**
- # (Index number)
- Department Name (e.g., "Bio")
- Faculty Name (e.g., "Science")
- Employee Name (Head of Department)
- Actions (View, Edit, Delete buttons)

**Actions:**
- **Add Department** button (top right) - Opens form dialog
- **Edit** (pencil icon) - Modify department details
- **Delete** (trash icon) - Remove department
- **View** (eye icon) - Placeholder for detail view

## ✨ Key Features

### ✅ Smart Validation
- **Faculty deletion**: System prevents deleting a faculty if it has departments
- **Required fields**: Name and Code are mandatory
- **Faculty selection**: Departments must be linked to an existing faculty

### 📝 Complete Forms
**Faculty Form Fields:**
- Faculty Name* (required)
- Faculty Code* (required, auto-uppercase)
- Dean (optional)
- Description (optional)

**Department Form Fields:**
- Department Name* (required)
- Department Code* (required, auto-uppercase)
- Faculty* (required dropdown)
- Head of Department (optional)
- Description (optional)

### 🔔 Notifications
Success and error messages appear as toast notifications:
- "Faculty created successfully"
- "Department updated successfully"
- "Cannot delete faculty with existing departments"
- etc.

## 📊 Sample Data

The system comes pre-loaded with sample data:

**4 Faculties:**
1. Science (SCI) - Prof. Sarah Johnson
2. Arts (ARTS) - Prof. Michael Chen
3. Engineering (ENG) - Prof. David Williams
4. Medicine (MED) - Dr. Emily Brown

**5 Departments:**
1. Bio (BIO) - Science Faculty
2. PharmaCeutical (PHARM) - Arts Faculty
3. Chemistry (CHEM) - Science Faculty
4. Physics (PHY) - Science Faculty
5. Computer Science (CS) - Engineering Faculty

## 🎬 Quick Test Workflow

1. **View Existing Data:**
   - Navigate to `/dashboard/senate`
   - You'll see the Department view by default
   - Click "Faculty" tab to see faculties

2. **Create a New Faculty:**
   ```
   Click "Add Faculty"
   Name: "Business"
   Code: "BUS"
   Dean: "Prof. John Doe"
   Click "Create"
   ```

3. **Create a Department:**
   ```
   Switch to "Department" tab
   Click "Add Department"
   Name: "Accounting"
   Code: "ACC"
   Faculty: Select "Business"
   Head: "Dr. Jane Smith"
   Click "Create"
   ```

4. **Edit an Item:**
   - Click the pencil icon on any row
   - Update the information
   - Click "Update"

5. **Test Validation:**
   - Try to delete "Science" faculty
   - You'll get an error because it has departments
   - First delete all Science departments
   - Then you can delete the faculty

## 🔧 Technical Notes

- **State Management**: All CRUD operations update the UI instantly
- **Data Persistence**: Currently using mock data (resets on refresh)
- **Backend Ready**: Service layer is ready for API integration
- **Responsive**: Works on desktop, tablet, and mobile devices

## 🚀 Next Steps

To integrate with real backend:
1. Update `src/services/senate.service.ts`
2. Replace mock data calls with API endpoints
3. Add authentication headers
4. Handle loading states
5. Implement pagination for large datasets

## 💡 Tips

- **Keyboard Navigation**: Use Tab to navigate through form fields
- **Quick Actions**: Hover over action buttons to see tooltips
- **Search**: Press Ctrl+F to search within the table
- **Refresh**: Press F5 to reload sample data

## 🎯 Integration with Main System

The E-Senate module is now part of your Week 1 deliverable:
- ✅ E-Senate implemented
- ✅ Faculty management complete
- ✅ Department management complete
- ✅ Sub-department structure ready (Department model)

---

**Enjoy managing your academic structure! 🎓**
