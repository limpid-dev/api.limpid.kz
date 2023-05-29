export default function createTemplate(payload: any) {
  let htmlContent: string = `
    
        <html>
        <head>
          <title>Пример PDF</title>
    </head>
    <body>
        <h1>Техзадание</h1>
    
        <em>Наименование организации:</em>
        <p>${payload.nameOfOrganisation} </p>
    
        <em>БИН/ИНН Заказчика:</em>
        <p>${payload.customerIdNumber}</p>
    
        <em>Наименование закупаемой услуги:</em>
        <p>${payload.nameOfServiceToBePurchased}</p>
    
        <em>Срок оказания услуги:</em>
        <p>${payload.serviceDeliveryTime}</p>
    
        <em>Место оказания услуги:</em>
        <p>${payload.placeOfServiceRendering}</p>
    
        <em>Размер авансового платежа:</em>
        <p>${payload.amountOfAdvancePayment}</p>
    
        <em>Условия оплаты: </em>
        <p>${payload.paymentTerms}</p>
    
        <em>Гарантийный срок (в месяцах): </em>
        <p>${payload.guaranteePeriod}</p>
    
        <em>Подробное описание услуг и требований:</em>
        <p>${payload.detailedDescriptionOfServiceRequirements}</p>
    
        <em>Исходные данные:</em>
        <p>${payload.inputData}</p>
    
        `
  if (payload.qualificationRequirementsForProspectiveVendors) {
    htmlContent += `
            <em>Квалификационные требования к Потенциальным поставщикам:</em>
            <p>${payload.qualificationRequirementsForProspectiveVendors}</p>
          `
  }

  if (payload.performanceSecurity) {
    htmlContent += `
            <em>Обеспечение исполнения договора:</em>
            <p>${payload.performanceSecurity}</p>
          `
  }

  if (payload.specialContractConditions) {
    htmlContent += `
            <em>Специальные условия договора:</em>
            <p>${payload.specialContractConditions}</p>
          `
  }

  htmlContent += `
        </body>
    </html>
    `

  return htmlContent
}
