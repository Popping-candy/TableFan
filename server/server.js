const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const PORT = process.env.port || 8000
const app = express()
const {Device, Sight, Audio, Haptic, Smell, Taste} = require('./model/model')
const {exec} =  require('node:child_process');
const fs = require('fs')
const now = require('nano-time');

//const url = 'mongodb+srv://user:user@cluster0.ts2fe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.set('strictQuery', true);
const url = 'mongodb://localhost:27017'

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log('Connected to database')
}).catch(err => console.log(err))

app.use(cors({
    origin: function(origin, callback){
      return callback(null, true);
    },
    optionsSuccessStatus: 200,
    credentials: true
  }));

app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({ extended: true, limit: '50mb'}))


app.listen(PORT, () => {
    console.log(`Server listening or port ${PORT}`)
})

// create the default device table
app.get('/createDeviceTable', async(req,res)=>{
    Device.findOne({name: req.body.device[0].name}, async(err, result) => {
        if (err) throw err
        if (result){
            console.log('Table has already exists')
            res.send('Table has already exists')
        }else{
            for (var i=0; i<req.body.device.length; i++){
                let device = new Device(req.body.device[i])
                await device.save()
            } 
            console.log('create data successfully')
            res.send('create data successfully')
        }
    })  
});

// check whether the default table contains the device and deploy 
app.get('/fans', async(req,res)=>{
    let requestTime = now();
    let start = process.hrtime.bigint();    
    Device.findOne({name: req.body.name}, async(err, device) => {
        if (err) throw err
        if (!device){
            res.send('Device is not exists')
        } else{
            Haptic.find({control: req.body.status},async(err,effect)=>{
                if (err) throw err
                if (effect.length==0){
                    res.status(202).send('This button has no effect yet')
                }else{
                    await runBashScript(req.body.status);
                    let processingTime = process.hrtime.bigint()-start;

                    var effectStr = "";
                    for (var i=0; i<effect.length; i++){
                        effectStr += effect[i]._id+',';
                    }
                    effectStr = effectStr.substring(0,effectStr.length-1)
                    var deploy = fs.createWriteStream("deployRecord.txt", {flags: 'a'})
                    deploy.write(`${req.body.status} is clicked, effect(s) ${effectStr} is deployed to fan\n`)
                    res.status(200).send(`Device ID: ${device.id} runs ${req.body.status}'s effect(s), 
                    processing time: ${processingTime}, receieved request: ${requestTime}`); 
                }
            })
        }
    })    
});

function runBashScript(status){
    switch (status){
        case 'btn_1': case'btn_2': case'btn_3':
            console.log(status)
        exec("sudo uhubctl -l 2 -a 1", (error, stdout, stderror) => {
            if (error) {
                console.log(`error: ${error.message}`);
                console.log(`error: on1`);
                return;
            }
            if (stderror) {
                console.log(`stderr: ${stderr}`);
                console.log(`error: on2`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`ok: on`);
        })
            
            break;
        case 'btn_off':
            console.log(status)
        exec("sudo uhubctl -l 2 -a 0", (error, stdout, stderror) => {
            if (error) {
                console.log(`error: ${error.message}`);
                console.log(`error: off1`);
                return;
            }
            if (stderror) {
                console.log(`stderr: ${stderr}`);
                console.log(`error: off1`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`ok: off`);
        })
            break;
    }
}

app.get('/customDevice', async(req,res)=>{
    let len = await Device.count()
    Device.findOne({name: req.body.name}, async(err, device) => {
        if (err) throw err
        if (device){
            res.send('Device is already exists')
        } else{
            let device = new Device({name:req.body.name, category:req.body.category, id:len+1});
            device.save();
            res.status(200).send(`Device ID: ${device.name} is added `); 
        }
    })    
});

app.get('/getDeviceEffectsId/:device', async(req,res)=>{ 
    let device = await Device.findOne({name:req.params.device});
    if (!device){
        res.send('This device has not save in the table yet')
    }
    else{
        console.log(device)
        let category = device.category;
        let effectId = [];
        if (category.includes("Sight")){
            let effect = await Sight.find({deviceId: req.params.device})
            if (effect){
                for (var i =0; i<effect.length; i++){
                    effectId.push(effect[i]._id+"_Sight");
                }
            }
        }
        if (category.includes("Audio")){
            let effect = await Audio.find({deviceId: req.params.device})
            if (effect){
                for (var i =0; i<effect.length; i++){
                    effectId.push(effect[i]._id+"_Audio");
                }
            }
        }
        if (category.includes("Haptic")) {
            let effect = await Haptic.find({deviceId: req.params.device})
            if (effect){
                for (var i =0; i<effect.length; i++){
                    effectId.push(effect[i]._id+"_Haptic");
                }
            }
        }
        if (category.includes("Smell")){
            let effect = await Smell.find({deviceId: req.params.device})
            if (effect){
                for (var i =0; i<effect.length; i++){
                    effectId.push(effect[i]._id+"_Smell");
                }
            }
        }    
        if(category.includes("Taste")){
            let effect = await Taste.find({deviceId: req.params.device})
            if (effect){
                for (var i =0; i<effect.length; i++){
                    effectId.push(effect[i]._id+"_Taste");
                }
            }
        }    
        if (effectId.length===0){
            res.status(202).send('Device has no effect yet')
        } else {
            effectId.push('|'+category)
            res.status(200).send(effectId);
        }   
    } 
})

app.get('/getDeviceEffect/:req', async(req,res)=>{
    console.log(req.params.req);
    let id = req.params.req.split('_')[0];
    let category = req.params.req.split('_')[1];
    let collection;
    switch (category){
        case "Sight": collection = Sight; break;
        case "Audio": collection = Audio; break;
        case "Haptic": collection = Haptic; break;
        case "Smell": collection = Smell; break;
        case "Taste": collection = Taste; break;
    }
    collection.findOne({_id: id}, async(err, effect) => {
        if (err) throw err
        if (!effect){
            res.send('Effect does not exist')
        } else{
            res.status(200).send(effect); 
        }
    })    
})
app.get('/CreateEffect/:deviceId', async(req,res) => {
    let category = req.body.category
    let collection;
    switch (category){
        case "Sight": collection = Sight; break;
        case "Audio": collection = Audio; break;
        case "Haptic": collection = Haptic; break;
        case "Smell": collection = Smell; break;
        case "Taste": collection = Taste; break;
    }
    let effect = new collection(req.body)
    effect.deviceId = req.params.deviceId;
    await effect.save();
    res.status(200).send(effect)
})



async function remove(id, previousCategory){
    switch (previousCategory){
        case "Sight":
            await Sight.findByIdAndRemove(id)
            break    
        case "Audio":
            await Audio.findByIdAndRemove(id)
            break  
        case "Haptic":
            await Haptic.findByIdAndRemove(id)
            break  
        case "Smell":
            await Smell.findByIdAndRemove(id)
            break  
        case "Taste":
            await Taste.findByIdAndRemove(id)
            break  
    }
}
function setEffect(effect, req){
    effect.deviceId=req.body.deviceId;
    effect.category=req.body.category;
    effect.control=req.body.control;
    effect.description.properties.type = req.body.description.properties.type;
    effect.description.properties.measure = req.body.description.properties.measure; 
    effect.description.properties.unit = req.body.description.properties.unit;
    effect.description.properties.quantity = req.body.description.properties.quantity;
    effect.description.pattern.type = req.body.description.pattern.type;
    effect.description.pattern.LengthMs = req.body.description.pattern.LengthMs;
}

app.get('/ManageEffect/:effectId', async(req,res) => {
    let category = req.body.category;
    let id = req.params.effectId.split('_')[0]
    let previousCategory = req.params.effectId.split('_')[1]
    let effect;
    switch (category){
        case "Sight":
            effect = await Sight.findById(id)
            if (!effect){
                effect = new Sight(req.body);
                effect.deviceId=req.body.deviceId;
                remove(id, previousCategory)
            }else{
                setEffect(effect,req);
                effect.description.properties.id = req.body.description.properties.id;
            }
            break;
        case "Audio": 
            effect = await Audio.findById(id)
            if (!effect){
                effect = new Audio(req.body);
                effect.deviceId=req.body.deviceId;
                remove(id, previousCategory)
            }else{
                setEffect(effect,req); 
            }    
            break;
        case "Haptic":
            effect = await Haptic.findById(id)
            if (!effect){
                effect = new Haptic(req.body);
                effect.deviceId=req.body.deviceId;
                remove(id, previousCategory)
            }else{
                setEffect(effect,req);
            }
            break;
        case "Smell": 
            effect = await Smell.findById(id)
            if (!effect){
                effect = new Smell(req.body);
                effect.deviceId=req.body.deviceId;
                remove(id, previousCategory)
            }else{
                setEffect(effect,req);
            }
            break;
        case "Taste":
            effect = await Taste.findById(id)
            if (!effect){
                effect = new Taste(req.body);
                effect.deviceId=req.body.deviceId;
                remove(id, previousCategory)
            }else{
                setEffect(effect,req);
            }
            break;
    }    
    await effect.save();
    res.status(200).send(effect)
})

