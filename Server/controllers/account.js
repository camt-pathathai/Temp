const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerAdmin = async(req,res) => {

    try{
        const { email, password } = req.body ;
        if(!email){
            return res.status(400).json({msg : "Email is required!"});
        }
        if(!password){
            return res.status(400).json({msg : "Password is required!"});
        }

        const user = await prisma.user.findFirst({
            where:{
                email: email 
            }
        });
        if(user){
            return res.status(400).json({msg : "Email already exists!"});
        }
        const hashpassword = await bcrypt.hash(password,10);
        
        await prisma.user.create({
            data:{
                email: email,
                password: hashpassword,
                role: 'admin',
            }
        });

        res.json({
            "success": true,
            "msg": "Registration successful"
        });

    }catch (err) {
        console.log(err)
        res.status(500).json({msg : "Server Error"});
    }
};

exports.register = async(req,res) => {

    try{
        const { email, password } = req.body ;
        if(!email){
            return res.status(400).json({msg : "Email is required!"});
        }
        if(!password){
            return res.status(400).json({msg : "Password is required!"});
        }

        const user = await prisma.user.findFirst({
            where:{
                email: email 
            }
        });
        if(user){
            return res.status(400).json({msg : "Email already exists!"});
        }
        const hashpassword = await bcrypt.hash(password,10);
        
        await prisma.user.create({
            data:{
                email: email,
                password: hashpassword,
                
            }
        });

        res.json({
            "success": true,
            "msg": "Registration successful"
        });

    }catch (err) {
        console.log(err)
        res.status(500).json({msg : "Server Error"});
    }
};


exports.login = async(req,res) => {
    try{
        const { email,password } = req.body ;
        const user = await prisma.user.findFirst({
            where:{
                email: email
            }
        });
        if(!user || !user.status){
            return res.status(400).json({msg : "Email not Found !"});
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({msg : "Password is not correct !"});
        }

        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        };

        const id = user.id;

        jwt.sign(payload,process.env.SECRET,{ expiresIn:'1d' },(err,token) => {
            if(err){
                return res.status(500).json({msg : "Server Error"});
            }
            //res.setHeader('authToken', `${token}`);
            return res.json({ payload, token, id,"success": true, });
        });

        
    }catch (err) {
        console.log(err);
        res.status(500).json({msg : "Server Error"});
    }
};

exports.currentUser = async(req,res) => {
    try{
        res.send('Hello Current User');

        
    }catch (err) {
        console.log(err);
        res.status(500).json({msg : "Server Error"});
    }
};
