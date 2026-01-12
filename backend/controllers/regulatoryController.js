import Regulatory from '../models/Regulatory.js';
import { broadcast } from '../websocket.js';

// Get all regulatory records
export const getAllRegulatory = async (req, res) => {
  try {
    const records = await Regulatory.findAll({
      order: [['deadline', 'ASC']]
    });
    
    res.json({
      success: true,
      data: records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch regulatory records',
      error: error.message
    });
  }
};

// Create new regulatory record
export const createRegulatory = async (req, res) => {
  try {
    const { name, description, status, progress, priority, deadline, category, icon, color, notes, company_id } = req.body;
    
    const record = await Regulatory.create({
      name,
      description,
      status,
      progress,
      priority,
      deadline,
      category,
      icon,
      color,
      notes,
      company_id
    });
    
    // Broadcast real-time update
    broadcast({
      type: 'regulatory_create',
      data: record,
      timestamp: new Date().toISOString()
    });
    
    console.log('Broadcasting regulatory create:', record.id);
    
    res.status(201).json({
      success: true,
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create regulatory record',
      error: error.message
    });
  }
};

// Update regulatory record
export const updateRegulatory = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const [updated] = await Regulatory.update(updates, {
      where: { id }
    });
    
    if (updated) {
      const record = await Regulatory.findByPk(id);
      
      // Broadcast real-time update
      broadcast({
        type: 'regulatory_update',
        data: record,
        timestamp: new Date().toISOString()
      });
      
      console.log('Broadcasting regulatory update:', record.id);
      
      res.json({
        success: true,
        data: record
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Regulatory record not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update regulatory record',
      error: error.message
    });
  }
};

// Delete regulatory record
export const deleteRegulatory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = await Regulatory.destroy({
      where: { id }
    });
    
    if (deleted) {
      res.json({
        success: true,
        message: 'Regulatory record deleted'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Regulatory record not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete regulatory record',
      error: error.message
    });
  }
};