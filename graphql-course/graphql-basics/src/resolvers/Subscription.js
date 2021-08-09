const Subscription={
    count:{
        subscribe(parent,args,{pubsub},info){
            let count=0;
            setInterval(()=>{
                count++;
                pubsub.publish('count',{count});
            },1000)
            //on event
            return pubsub.asyncIterator('count');
        }
    }
};

export default Subscription;