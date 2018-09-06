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
      async downloadCsv() {
         // var csvData = {
         //    data: this.convertedMultiCurrency,
         //    amount: this.amount,
         //    from: this.convertfrom
         // }

         var getCsv = axios.get(window.location + 'currency/getCsv')

         try{
            var getCsvResponse = await getCsv;
         } catch (error) {
            alert(error)
         }
      }
   },
   mounted: function () {
	  this.getCurrency();
   }
});