const _ = require('underscore'); // undefined ->  _
var mustache = require('mustache');
var pdf = require('html-pdf');
var path = require('path');
var fs = require('fs');


exports.generatePdfForm = async ({ formData, templateName ,name }) => {  // undefined parameter ->  templateName
     try {
          var templatePath;
          var template;
          let model;

          switch (name) {

               case "1":
                    templatePath = path.resolve(
                         'formsTemplate/form 1 Input of material requirements WITH services.html'
                    );
                    template = fs.readFileSync(templatePath, 'utf8');
                    model = {
                         customer: formData.customerInfo && formData.customerInfo.firstName && formData.customerInfo.lastName ? formData.customerInfo.firstName + ' ' + formData.customerInfo.lastName : "",
                         phone: formData.customerInfo && formData.customerInfo.phone ? formData.customerInfo.phone : "",
                         email: formData.customerInfo && formData.customerInfo.emailId ? formData.customerInfo.emailId : "",
                         country: formData.customerInfo && formData.customerInfo.country ? formData.customerInfo.country : "",
                         cityState: formData.customerInfo && formData.customerInfo.cityState ? formData.customerInfo.cityState : "",
                         address: formData.customerInfo && formData.customerInfo.address ? formData.customerInfo.address : "",
                         yearOfConstruction: formData.propertyInfo && formData.propertyInfo.yearOfConstruction ? formData.propertyInfo.yearOfConstruction : "",
                    };
                    break;
               case "2":
                    templatePath = path.resolve(
                         'formsTemplate/form 2 material requirements for renovation.html'
                    );
                    template = fs.readFileSync(templatePath, 'utf8');
                    model = {
                         customer: formData.customerInfo && formData.customerInfo.firstName && formData.customerInfo.lastName ? formData.customerInfo.firstName + ' ' + formData.customerInfo.lastName : "_",
                         // address: formData.customerInfo.address ? formData.customerInfo.address : "_",
                         // phone: formData.customerInfo.phone ? formData.customerInfo.phone : "_",
                         // email: formData.customerInfo.emailId ? formData.customerInfo.emailId : "_",
                    };
                    break;
              case"3":
                    templatePath = path.resolve(
                         'formsTemplate/formTemplate.html'
                    );
                    template = fs.readFileSync(templatePath, 'utf8');
                    model = {
                         customer: formData.customerInfo && formData.customerInfo.firstName && formData.customerInfo.lastName ? formData.customerInfo.firstName + ' ' + formData.customerInfo.lastName : "",
                         serviceType: formData.customerInfo && formData.customerInfo.serviceType ? formData.customerInfo.serviceType : "",
                         scheduleDate: formData.finalNotes && formData.finalNotes.scheduleDate ? formData.finalNotes.scheduleDate : "_",
                         date: formData.finalNotes && formData.finalNotes.date ? formData.finalNotes.date : "_",
                         constructionType: formData.constructionInfo && formData.constructionInfo.constructionInfo ? formData.constructionInfo.constructionInfo : "_",
                         customerAccountName: formData.customerAccountName ? formData.customerAccountName : "_",
                         accountType: formData.customerInfo.accountType ? formData.customerInfo.accountType : "_"
                    };
                    break;

          }
          let html = mustache.render(template, model);
          let statusPath = path.resolve('formPdf/' + 'form' + name + '.pdf');
          return await new Promise((resolve, reject) => {
               pdf.create(html, {
                    orientation: 'portrait',
                    format: 'A4',
                    timeout: '50000000',
                    border: '0',
                    renderDelay: 5000,
                    childProcessOptions: {
                         env: {
                              OPENSSL_CONF: '/dev/null',
                         }
                    }
               }).toFile(statusPath, async (err , result ) => { 
                    if (err) {
                         return reject(err);
                    }
                    resolve('form' + name + '.pdf' , result);  // add result
               });
          });
     } catch (err) {
          console.log(err);
          throw err;
     }
};
