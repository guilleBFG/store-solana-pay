import orders from "./orders.json";
import { writeFile } from "fs/promises";
import { emitWarning } from "process";


function get(req, res){
    const {buyer} = req.query;

    const buyerOrders = orders.filter((order) => order.buyer === buyer);
    if(buyerOrders.length === 0){
        res.status(204).send();
    }
    else{
        res.status(200).json(buyerOrders);
    }
}

async function post(req, res) {
    console.log("received add order to request", req.body);

    try {
        const newOrder = req.body;

        if(!orders.find((order) => order.buyer === newOrder.buyer.toString() && order.itemID === newOrder.itemID)){
            orders.push(newOrder);
            await writeFile("./pages/api/orders.json", JSON.stringify(orders, null, 2));
            res.status(200).json(orders);
        }else{
            res.status(400).send("order already exist");
        }
    } catch (error) {
        res.status(400).send(error);
    }
}

export default async function handler(req,res){
    switch(req.method){
        case "GET":
            get(req,res);
            break;
        case "POST":
            await post(req,res);
            break;
        default:
            res.status(405).send(`Method ${req.method} not allowed`);
    }
}