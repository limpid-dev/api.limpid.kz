let payObj = {}
let rsp
let btn2 = document.querySelector('#pay2')
let btn1 = document.querySelector('#pay')
document.addEventListener("DOMContentLoaded", () => {
  postData()
})
btn2.addEventListener('click', function pay() {
    halyk.pay(payObj)
})
async function postData(url = "http://localhost:3333/payment", data = {"planId": 1, "userId": 6}) {

    try {
        const response = await fetch(url, {
          withCredentials: true,
            credentials: 'include',
            method: "POST", 
            body: JSON.stringify(data), // body data type must match "Content-Type" header
            headers: {
              "Content-Type": "application/json",
              "Accept": "*/*",
            },
          })
           rsp = await response.json();
           payObj.invoiceId = rsp.payment.id
           payObj.language = rsp.payment.language
           payObj.description = rsp.payment.description
           payObj.terminal = rsp.payment.terminal
           payObj.amount = rsp.payment.amount
           payObj.currency = rsp.payment.currency
           payObj.accountId = rsp.payment.userId
           payObj.auth = rsp.data
           payObj.postLink = 'http://localhost:3333/accepted-payment'
           payObj.failurePostLink = 'http://localhost:3333/refused-payment'
           payObj.cardSave = true
           payObj.backLink = 'http://localhost:5500/'
      } catch (error) {
        console.error(error);
      }
  }