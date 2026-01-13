# Compliance Validation Feature

## Overview
The compliance validation feature provides comprehensive checking of ESG compliance against major frameworks including GRI, SASB, TCFD, and BRSR.

## Features

### Framework Support
- **GRI Standards**: Global Reporting Initiative standards
- **SASB Standards**: Sustainability Accounting Standards Board
- **TCFD Framework**: Task Force on Climate-related Financial Disclosures
- **BRSR Framework**: Business Responsibility and Sustainability Reporting

### Validation Checks
- Required regulation compliance
- Category-wise progress assessment
- Overall compliance scoring
- Issue identification and recommendations

### API Endpoints

#### Validate Compliance
```
GET /api/compliance/validate?framework={framework}&companyId={companyId}
```

**Parameters:**
- `framework` (optional): GRI, SASB, TCFD, or BRSR (default: GRI)
- `companyId` (optional): Specific company ID for validation

**Response:**
```json
{
  "success": true,
  "data": {
    "framework": "GRI",
    "overallCompliance": 75,
    "status": "Mostly Compliant",
    "issues": [],
    "recommendations": [],
    "categoryScores": {
      "Environmental": 80,
      "Social": 85,
      "Governance": 60
    },
    "missingRequirements": [],
    "passedChecks": [],
    "totalChecks": 6,
    "passedCount": 4
  }
}
```

## Usage

### Backend Setup
1. Ensure compliance data exists in the database
2. Run seed script if needed: `npm run seed-compliance`
3. The validation endpoint will be available at `/api/compliance/validate`

### Frontend Usage
1. Navigate to the Compliance page
2. Select desired framework from dropdown
3. Click "Check Compliance" button
4. View validation results including:
   - Overall compliance percentage
   - Compliance status
   - Category-wise scores
   - Issues and recommendations

## Framework Requirements

### GRI Standards
- Environmental Policy
- Social Impact Assessment  
- Board Governance
- Minimum 80% progress required

### SASB Standards
- Material ESG Metrics
- Industry Standards
- Risk Management
- Minimum 75% progress required

### TCFD Framework
- Climate Risk Assessment
- Governance Structure
- Strategy Disclosure
- Minimum 85% progress required

### BRSR Framework
- Business Responsibility
- Stakeholder Engagement
- ESG Performance
- Minimum 70% progress required

## Status Levels
- **Fully Compliant**: 100% requirements met with no issues
- **Mostly Compliant**: ≥80% of minimum progress with minor issues
- **Partially Compliant**: ≥60% of minimum progress
- **Non-Compliant**: <60% of minimum progress

## Sample Data
Use the provided seed script to populate sample compliance data for testing:
```bash
npm run seed-compliance
```

This will create sample regulations across Environmental, Social, and Governance categories with varying progress levels.