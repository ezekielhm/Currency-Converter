var vm = new Vue({
    el: '#databinding',
    data: {
      name:'',
      currencyfrom : [
         {name : "USD", desc:"US Dollar"},
         {name:"EUR", desc:"Euro"},
         {name:"INR", desc:"Indian Rupee"},
         {name:"BHD", desc:"Bahraini Dinar"}
      ],
      convertfrom: "INR",
      convertto:"USD",
      amount :"1",
      finalAmount: "",
      MultiCurrvalue: [],
      convertedMultiCurrency: [],
      showDownload: false
    },
    components: {
      Multiselect: window.VueMultiselect.default
    },
    watch: {
      amount: function (val) {
        this.convertedMultiCurrency = [];
        this.showDownload = false;
      },
      convertfrom: function (val) {
        this.convertedMultiCurrency = [];
        this.showDownload = false;
      }
    },
    methods: {
      async getCurrency(){
          this.currencyfrom = [];
          var currencyInfo = axios.get(window.location + 'currency/getAll')
          try{
            var currencyInfoResponse = await currencyInfo

            if(currencyInfoResponse.data.status = 'success'){
               for (let code in currencyInfoResponse.data.data){
                  let tempInfo = {
                     name:  currencyInfoResponse.data.data[code].id,
                     desc:  currencyInfoResponse.data.data[code].currencyName
                  }
                  this.currencyfrom.push(tempInfo);
               }
            } else {
               alert('Server Error: did not retrieve currency');
            }


         } catch (error) {
            alert(error)
         }
      },
      async convertCurency(){
         var currencyToConvert = {
            from: this.convertfrom,
            to: this.convertto,
            amount: this.amount
         }
         var currencyConvert = axios.post(window.location + 'currency/convert',
            currencyToConvert,
            { headers: { 'Content-Type': 'application/json' } }
         )

         try{
            var currencyConvertResponse = await currencyConvert;

            if(currencyConvertResponse.data){
               if(currencyConvertResponse.data.status = 'success'){
                  this.finalAmount = currencyConvertResponse.data.data
               } else {
                  alert(currencyConvertResponse.data.data)
               }
            }
         } catch (error) {
            alert(error)
         }
      },
      async convertMultiple(){
         if (this.MultiCurrvalue.length > 6) {
            alert('Multi currency select must be 6 or less')
            return null;
         }

         var currenctToConvert = {
            from: this.convertfrom,
            arrCurrencyToConvert: this.MultiCurrvalue,
            amount: this.amount
         }

         var multiCurrConvert = axios.post(window.location + 'currency/multiConvert',
            currenctToConvert,
            { headers: { 'Content-Type': 'application/json' } }
         )

         try{
            var multiCurrConvertResponse = await multiCurrConvert

               if(multiCurrConvertResponse.data.status = 'success'){
                  this.convertedMultiCurrency = multiCurrConvertResponse.data.data
               } else {
                  alert(multiCurrConvertResponse.data.data)
               }


         } catch (error) {
            alert(error)
         }
         this.showDownload = true;
      },
      downloadCsv() {
         this.JSONToCSVConvertor(this.convertedMultiCurrency,'From: ' + this.convertfrom + ' Amount: ' + this.amount,true)
      },
      JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
          var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
          
          var CSV = '';    

          
          CSV += ReportTitle + '\r\n\n';

          if (ShowLabel) {
              var row = "";
              for (var index in arrData[0]) {
                  row += index + ',';
              }

              row = row.slice(0, -1);

              CSV += row + '\r\n';
          }
          

          for (var i = 0; i < arrData.length; i++) {
              var row = "";
              for (var index in arrData[i]) {
                  row += '"' + arrData[i][index] + '",';
              }
              row.slice(0, row.length - 1);
              CSV += row + '\r\n';
          }

          if (CSV == '') {        
              alert("Invalid data");
              return;
          }   
          

          var fileName = "MultiConvert_";
          fileName += ReportTitle.replace(/ /g,"_");   
          
          var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
          
          var link = document.createElement("a");    
          link.href = uri;
          
          link.style = "visibility:hidden";
          link.download = fileName + ".csv";

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }
   },
   mounted: function () {
	  this.getCurrency();
   }
});