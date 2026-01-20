# Stakeholder Field Constraints

## Required Fields
- `name` (string, max 255 characters) - **Required**

## Constrained Fields
- `type` - Must be one of: `"Internal"` or `"External"`
- `engagement_level` - Must be one of: `"Low"`, `"Medium"`, or `"High"` (default: "Medium")
- `priority` - Must be one of: `"Low"`, `"Medium"`, or `"High"` (default: "Medium")
- `stakeholder_percentage` - Must be between 0 and 100 (default: 0)

## Optional Fields
- `description` (text)
- `key_concerns` (text)
- `next_action` (string, max 255 characters)
- `contact_email` (string, max 255 characters, must be valid email)
- `department` (string, max 150 characters)
- `icon` (string, max 100 characters, default: "user")
- `last_contact` (date)

## Example Valid Stakeholder Data
```json
{
  "name": "John Doe",
  "type": "Internal",
  "engagement_level": "High",
  "priority": "Medium",
  "description": "Key internal stakeholder from IT department",
  "contact_email": "john.doe@company.com",
  "department": "IT",
  "stakeholder_percentage": 15.5
}
```

## Common Errors
1. **Type constraint violation**: Using values other than "Internal" or "External"
2. **Engagement/Priority constraint violation**: Using values other than "Low", "Medium", or "High"
3. **Email validation**: Invalid email format
4. **Percentage range**: Values outside 0-100 range