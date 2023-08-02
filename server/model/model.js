const mongoose = require('mongoose')

const deviceSchema = new mongoose.Schema({
  id: { type: Number},
  name: { type: String},
  category: { type: String},
})  
const Device = new mongoose.model('Device', deviceSchema);

const hapticSchema = new mongoose.Schema({
        deviceId : String,
        control:String,
        category:String,
      
        description:{
          properties:{
            type:{type:String},
            measure:String,
            unit:String,
            quantity: Number
          },
          pattern:{
            type:{type:String},
            LengthMs:Number
          }
        }     
})
const Haptic = new mongoose.model('Haptic', hapticSchema);

const sightSchema = new mongoose.Schema({
  deviceId : String,
  control:String,
  category:String,
  description:{
    properties:{
      type:{type:String},
      measure:String,
      unit:String,
      quantity: Number
    },
    pattern:{
      type:{type:String},
      LengthMs:Number
    }
  }
})
const Sight = new mongoose.model('Sight', sightSchema);

const audioSchema = new mongoose.Schema({
  deviceId : String,
  control:String,
  category:String,
  description:{
    properties:{
      type:{type:String},
      measure:String,
      unit:String,
      quantity: Number
    },
    pattern:{
      type:{type:String},
      LengthMs:Number
    }
  }
})
const Audio = new mongoose.model('Audio', audioSchema);

const smellSchema = new mongoose.Schema({
  deviceId : String,
  control:String,
  category:String,
  description:{
    properties:{
      type:{type:String},
      measure:String,
      unit:String,
      quantity: Number
    },
    pattern:{
      type:{type:String},
      LengthMs:Number
    }
  }
})
const Smell = new mongoose.model('Smell', smellSchema);

const tasteSchema = new mongoose.Schema({
  deviceId : String,
  control:String,
  category:String,
  description:{
    properties:{
      type:{type:String},
      measure:String,
      unit:String,
      quantity: Number
    },
    pattern:{
      type:{type:String},
      LengthMs:Number
    }
  }
})
const Taste = new mongoose.model('Taste', tasteSchema);
 
module.exports.Device = Device;
module.exports.Haptic = Haptic;
module.exports.Sight = Sight;
module.exports.Audio = Audio;
module.exports.Smell = Smell;
module.exports.Taste = Taste;
