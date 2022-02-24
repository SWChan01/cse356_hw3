const express = require('express')
const amqp = require('amqplib/callback_api');

const app = express()
app.use(express.json())
const port = 3000



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/listen', async (req,res)=>{

    const {keys} = req.body

    amqp.connect('amqp://newadmin:143512@209.151.151.151', (err,connection)=>{
        if (err) {
            throw err;
        }

        connection.createChannel((err,channel)=>{

            if(err) throw err;
            

            //create exchange
            channel.assertExchange('hw3','direct',{
                durable:false 
            });


            channel.assertQueue('', {
                exclusive: true
                },(error2, q)=> {
                  if (error2) {
                    throw error2;
                  }
          
          
                keys.forEach((key)=> {
                    channel.bindQueue(q.queue, exchange, key);
                });



                channel.consume(q.queue, (msg)=> {
                    res.send({msg:msg})
                }, {
                  noAck: true
                });
            });

            

        })
    })
})


app.post('/speak', async (req,res)=>{

    const {key,msg} = req.body

    amqp.connect('amqp://newadmin:143512@209.151.151.151', (err,connection)=>{
        if (err) {
            throw err;
        }

        connection.createChannel((err,channel)=>{

            if(err) throw err;
            

            //create exchange
            channel.assertExchange('hw3','direct',{
                durable:false 
            });


            channel.publish(exchange, key, msg);

            

        })



    })

    res.status(200)

})




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})