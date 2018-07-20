const customerAddresData = require('./data/m3-customer-address-data.json')
const customerData = require('./data/m3-customer-data.json')
const mongodb = require('mongodb')
const async = require('async')

// Mongo create
const url = 'mongodb://localhost:27017/edx-course-db'

// Instantiate

const MongoClient = mongodb.MongoClient

const recordsAmount = Number(process.argv[2])

const mergeData = () => {
    customerData.map((record, index) => {
        record.country = customerAddresData[index].country
        record.city = customerAddresData[index].city
        record.state = customerAddresData[index].state
        record.phone = customerAddresData[index].phone
    })
    return customerData
}

const processToRun = mergeData().length/recordsAmount
const arrayMethods = []

const fillExceArray = (records) => {
    const arrayToExcecute = Array(processToRun).fill(0)
    arrayToExcecute.map((a, index) => {
        if(index == 0 ){
            arrayMethods.push(function(callback){
                addRecordsToDB(customerData.slice(index,index+recordsAmount))
            })
        }
        else{
            const i = index*recordsAmount
            arrayMethods.push(function(callback){
                addRecordsToDB(customerData.slice(i,i+recordsAmount))
            })
        }
    })
    async.parallel(arrayMethods, (err, result) => {

    })
}

const addRecordsToDB = (records) => {
    MongoClient.connect(url, (error, client) => {
        if (error) return process.exit(1)
    
        const db = client.db('edx-course-db')

        db.collection('customers').insert(records, (error, results) => {
            if (error) return process.exit(1)
            client.close()
        })
        
    })
}

fillExceArray()