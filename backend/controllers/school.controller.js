const School = require('../models/school.model');
const { asyncHandler } = require('../middlewares/error.middleware');

class SchoolController {
  // Create new school
  static create = asyncHandler(async (req, res) => {
    const { name, address, phone, email } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'School name is required'
      });
    }
    
    const schoolData = { name, address, phone, email };
    const school = await School.create(schoolData);
    
    res.status(201).json({
      success: true,
      message: 'School created successfully',
      data: school
    });
  });
  
  // Get all schools
  static getAll = asyncHandler(async (req, res) => {
    const schools = await School.findAll();
    
    res.json({
      success: true,
      message: 'Schools retrieved successfully',
      data: schools,
      count: schools.length
    });
  });
  
  // Get school by ID
  static getById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const school = await School.findById(id);
    
    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }
    
    res.json({
      success: true,
      message: 'School retrieved successfully',
      data: school
    });
  });
  
  // Update school
  static update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    
    const school = await School.update(id, updateData);
    
    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }
    
    res.json({
      success: true,
      message: 'School updated successfully',
      data: school
    });
  });
  
  // Delete school
  static delete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const school = await School.delete(id);
    
    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }
    
    res.json({
      success: true,
      message: 'School deleted successfully'
    });
  });
  
  // Get school statistics
  static getStats = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Verify school exists
    const school = await School.findById(id);
    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }
    
    const stats = await School.getStats(id);
    
    res.json({
      success: true,
      message: 'School statistics retrieved successfully',
      data: stats
    });
  });
}

module.exports = SchoolController;