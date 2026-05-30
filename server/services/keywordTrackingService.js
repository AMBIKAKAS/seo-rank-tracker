import {rankTracker} from"./rankTrackerService.js";

export async function keywordTracking(tracking){
    try {
        let result;
    

        // Try upto2 timesfor reliability
        for(let attempt=1;attempt<=2;attempt++){
            result=await rankTracker(tracking.keyword,tracking.domain)
            if(result.success && result.data.totalResultsScanned>0)break;
            if(attempt<2) await new Promise((r)=>setTimeout(r,result.success?3000:5000))}
if(result.success){
    const prev= tracking.currentPosition;
    const today= new Date()
    today.setHours(0,0,0,0);

    tracking.currentPosition= result.data.position;
    tracking.currentPosition=result.data.page;
    tracking.competitors= result.data.competitors;
    tracking.lastChecked=new Date();
    tracking.status= "completed";
    //Update status

    tracking.positionChange= prev && result.data.position ? prev -result.data.position:0;
    if(result.data.position && (!tracking.bestPosition || result.data.position < tracking.bestPosition)){
        tracking.bestPosition = result.data.position;
    }
    //update history
    const historyEntry= {
        date:today,
        position:result.data.page,
    }
}

    } catch (error) {
        
    }
}