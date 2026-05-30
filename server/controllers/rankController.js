import KeywordTracking from "../models/keywordTracking";


export const addKeyword = async(req,res)=>{
try {
    const{keyword,url} = req.body;
    
    if(!keyword || !url) return res.status(400).json({success:false,message:"Keyword and URL are required"});

    let domain;
    try {
        const urlobj = new URL(url.startsWith("http")?url:'https://${url}')
        domain = urlobj.hostname.replace ("wwww.","")
    } catch {
        return res.status(400).json({succcess:false,message:"Invalid URL format"})
    }

    const existing =await KeywordTracking.findOne({userId:req.userId,keyword: keyword.toLowercase().trim(),domain});

    if (existing){
        return res.status(400).json({success:false ,message:"already tracking this keyword for domian"});
    }
    const tracking = await keywordTracking.create({
        userID: req.userId,
        keyword:keyword.toLowercase().trim(),
        url:url.startsWith("http")?url:'https://${url}',
        domain,
        status:"checking"
    })
    res.status(201).json({success:true,message:"keyword tracking started",tracking});
    
} catch (error) {
    
}
}
export const getKeywords = async(req,res)=>{

}
export const getKeyword = async(req,res)=>{

}
export const refreshKeywords = async(req,res)=>{

}
export const deleteKeywords = async(req,res)=>{

}
export const toggleTracking = async(req,res)=>{

}