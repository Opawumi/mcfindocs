# E-Senate Module - Faculty & Department Management

## Overview
The E-Senate module provides comprehensive management capabilities for academic faculties and departments. It features a clean, table-based interface for viewing, creating, editing, and deleting organizational units.

## Features

### Faculty Management
- **Create Faculties**: Add new academic faculties with name, code, dean, and description
- **Edit Faculties**: Update faculty information
- **Delete Faculties**: Remove faculties (with validation to prevent deletion if departments exist)
- **View Faculties**: Table view showing all faculties with their details

### Department Management
- **Create Departments**: Add new departments linked to faculties
- **Edit Departments**: Update department information including faculty reassignment
- **Delete Departments**: Remove departments from the system
- **View Departments**: Table view showing department name, faculty, and head of department

## User Interface

### Navigation
- Sidebar with two tabs: **Faculty** and **Department**
- Clean, modern design matching the application theme
- Quick access to both management sections

### Table View
- **Faculty Table Columns**:
  - # (Index)
  - Faculty Name
  - Code
  - Dean
  - Actions (View, Edit, Delete)

- **Department Table Columns**:
  - # (Index)
  - Department Name
  - Faculty Name
  - Employee Name (Head of Department)
  - Actions (View, Edit, Delete)

### Actions
- 👁️ **View**: View detailed information (placeholder for future detail view)
- ✏️ **Edit**: Open dialog to edit item
- 🗑️ **Delete**: Open confirmation dialog to delete item

## Technical Details

### File Structure
```
src/
├── features/
│   └── senate/
│       ├── components/
│       │   ├── senate-management.tsx       # Main component
│       │   ├── faculty-form-dialog.tsx     # Faculty form
│       │   └── department-form-dialog.tsx  # Department form
│       └── index.ts
├── lib/
│   ├── types/
│   │   └── senate.types.ts                 # Type definitions
│   └── mock-data/
│       └── senate.mock.ts                  # Mock data
├── services/
│   └── senate.service.ts                   # Service layer (CRUD operations)
└── app/
    └── (dashboard)/
        └── dashboard/
            └── senate/
                └── page.tsx               # Senate page route
```

### Data Models

**Faculty**:
```typescript
{
  id: string;
  name: string;
  code: string;
  description?: string;
  dean?: string;
  createdAt: string;
  updatedAt: string;
}
```

**Department**:
```typescript
{
  id: string;
  name: string;
  code: string;
  facultyId: string;
  facultyName?: string;
  headOfDepartment?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
```

## How to Access
1. Navigate to **Dashboard** → **E-Senate** from the sidebar
2. Use the sidebar within E-Senate to switch between Faculty and Department views
3. Click "Add Faculty" or "Add Department" to create new items
4. Use action buttons on each row to view, edit, or delete items

## Validation & Rules
- ✅ **Required Fields**:
  - Faculty: Name, Code
  - Department: Name, Code, Faculty
  
- 🚫 **Delete Restrictions**:
  - Cannot delete a faculty if it has departments
  - Must first delete or reassign departments before deleting a faculty

- ✏️ **Edit Capabilities**:
  - All fields can be updated
  - Departments can be reassigned to different faculties

## Mock Data
The system comes with sample data:
- **4 Faculties**: Science, Arts, Engineering, Medicine
- **5 Departments**: Bio, PharmaCeutical, Chemistry, Physics, Computer Science

## Future Enhancements
- [ ] Detail view modal for faculties and departments
- [ ] Export to Excel/PDF
- [ ] Search and filter functionality
- [ ] Pagination for large datasets
- [ ] Department statistics and reporting
- [ ] Faculty-based user access control
- [ ] Integration with real database backend

## Backend Integration
Currently using mock data. To connect to a real backend:
1. Replace mock data imports in `senate.service.ts`
2. Update service functions to make API calls
3. Add proper error handling and loading states
4. Implement actual authentication/authorization

## Success Messages
- ✅ Faculty created successfully
- ✅ Faculty updated successfully  
- ✅ Faculty deleted successfully
- ✅ Department created successfully
- ✅ Department updated successfully
- ✅ Department deleted successfully

## Error Handling
- ❌ Cannot delete faculty with existing departments
- ❌ Faculty not found
- ❌ Department not found
- ❌ Failed to save (network/validation errors)
