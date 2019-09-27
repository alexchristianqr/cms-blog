import Moment from 'moment'
import $ from 'jquery'
import 'daterangepicker'
import AuthService from './services/AuthService'
import Storage from 'vue-local-storage'

export default {
  getLabelMonths(i){
    let dataMonths = [
      {item:'Enero', value:1},
      {item:'Febrero', value:2},
      {item:'Marzo', value:3},
      {item:'Abril', value:4},
      {item:'Mayo', value:5},
      {item:'Junio', value:6},
      {item:'Julio', value:7},
      {item:'Agosto', value:8},
      {item:'Setiembre', value:9},
      {item:'Octubre', value:10},
      {item:'Noviembre', value:11},
      {item:'Diciembre', value:12},
    ]
    if(i !== undefined){
      return dataMonths[i]
    }else{
      return dataMonths
    }
  },
  abbreviateValueNumber(num, fixed){
    num = parseFloat(num)
    if(num === null){ return null } // terminate early
    if(num === 0){ return '0' } // terminate early
    fixed = (!fixed || fixed < 0) ? 0 : fixed // number of decimal places to show
    let b = (num).toPrecision(2).split('e'), // get power
    k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
    c = k < 1 ? num.toFixed(fixed) : (num / Math.pow(10, k * 3)).toFixed(1 + fixed), // divide by power
    d = c < 0 ? c : Math.abs(c) // enforce -0 is 0
    return d + ['', 'K', 'M', 'B', 'T'][k] // append power
  },
  isSuper(){
    return (Storage.get('data-auth').role_id === 1)
  },
  roomIO(){
    return 'room-' + Storage.get('data-auth').client_id
  },
  clientId(){
    return Storage.get('data-auth').client_id
  },
  roleId(){
    return Storage.get('data-auth').role_id
  },
  userId(){
    return Storage.get('data-auth').id
  },
  sidebarMinimized(){
    return Storage.get('data-auth').sidebar_minimized
  },
  sidebarHide(){
    return Storage.get('data-auth').sidebar_hide
  },
  chatSound(){
    return Storage.get('data-auth').chat_sound_notification
  },
  issetStorage(name){
    return Storage.get(name)
  },
  generalSound(){
    return Storage.get('data-auth').general_sound_notification
  },
  userImage(image){
    if(image !== undefined){
      return API + '/images/avatars/' + image
    }else{
      return API + '/images/avatars/' + Storage.get('data-auth').image
    }
  },
  cleanModal(){
    window.document.body.classList.remove('modal-open')
    window.document.body.removeAttribute('data-modal-open-count')
    window.document.body.removeAttribute('data-padding-right')
    window.document.body.removeAttribute('style')
  },
  handleException(e, self){
    if(self.ioparams !== undefined){
      if(typeof self.ioparams.intervals === 'object'){
        if(self.ioparams.intervals.length > 0){
          self.ioparams.intervals.forEach((item)=>{
            clearInterval(item)
          })
        }
      }
    }
    if(typeof e.response === 'object'){
      if(e.response.status === 401) AuthService.dispatch('updateUnauthorized', {self:self})
      if(e.response.status === 500 || e.response.status === 429) self.dataResponse.dataErrors = e.response.data.message
      if(e.response.status === 425) self.dataResponse.dataErrors = "Ha ocurrido un problema, intentelo en breve"
      if(self.loading.button !== undefined) self.loading.button = false
      if(self.dataResponse.dataErrors !== undefined){
        self.dataResponse.dataErrors = {}
        self.dataResponse.dataErrors = e.response.data
      }
    }
    console.error(e)
  },
  resize(element){
    let tx = document.getElementById(element)
    tx.setAttribute('style', 'height:' + (tx.scrollHeight) + 'px; resize:none;')
    tx.addEventListener('input', OnInput, false)

    function OnInput(){
      this.style.height = 'auto'
      if(this.scrollHeight <= 75){
        this.style.height = (this.scrollHeight) + 'px'
      }else{
        this.style.height = '75px'
      }
    }
  },
  generateKeyPaginate(total, perpage, to, from, self = {}){
    self.dataKeysGenerate = []
    if(total >= to){
      while(perpage > 0){
        self.dataKeysGenerate.push(from++)
        perpage--
      }
    }
  },
  initializeDateRangePicker({self}, isTimePicker = false, isSingleDate = false, ele = ".date_range", myfn = undefined){
    /*
     Plugin DateRangerPicker
     http://www.daterangepicker.com/
     */
    $(document).ready(()=>{
      if(self.params.date_range !== null){

        let split_date_range = self.params.date_range.split('/')
        let start = Moment(split_date_range[0]),
        end = Moment(split_date_range[1])

        const cb = (start, end)=>{
          if(isTimePicker){
            if(isSingleDate){
              $(ele + ' span').html(start.format('DD/MM/YYYY HH:mm:ss'))
            }else{
              $(ele + ' span').html(start.format('DD/MM/YYYY HH:mm:ss') + '<span class="ml-2 mr-2">-</span>' + end.format('DD/MM/YYYY HH:mm:ss'))
            }
          }else{
            if(isSingleDate){
              $(ele + ' span').html(start.format('DD/MM/YYYY'))
            }else{
              $(ele + ' span').html(start.format('DD/MM/YYYY') + '<span class="ml-2 mr-2">-</span>' + end.format('DD/MM/YYYY'))
            }
          }
        }

        $(ele).daterangepicker(this.configDateRangePicker(start, end, Moment, isTimePicker, isSingleDate), cb)
        cb(start, end)

        if(typeof myfn === 'function'){
          myfn()
        }else{
          $(ele).on('apply.daterangepicker', (ev, picker)=>{
            self.params.date_range = null
            if(isTimePicker){
              if(isSingleDate){
                self.params.date_range = picker.startDate.format('YYYY-MM-DD HH:mm:ss')
              }else{
                self.params.date_range = picker.startDate.format('YYYY-MM-DD HH:mm:ss') + '/' + picker.endDate.format('YYYY-MM-DD HH:mm:ss')
              }
            }else{
              if(isSingleDate){
                self.params.date_range = picker.startDate.format('YYYY-MM-DD')
              }else{
                self.params.date_range = picker.startDate.format('YYYY-MM-DD') + '/' + picker.endDate.format('YYYY-MM-DD')
              }
            }
            if(self.doRequestServer !== undefined) self.doRequestServer()
          })
        }
      }
    })
  },
  configDateRangePicker(start, end, Moment, isTimePicker, isSingleDate){
    if(isSingleDate){
      return {
        timePicker:isTimePicker,
        singleDatePicker:isSingleDate,
        locale:{
          cancelLabel:'Cancelar',
          applyLabel:'Aceptar',
          format:(isTimePicker) ? 'DD/MM/YYYY HH:mm:ss' : 'DD/MM/YYYY',
        },
        showDropdowns:true,
        autoUpdateInput:true,
      }
    }else{
      return {
        timePicker:isTimePicker,
        singleDatePicker:isSingleDate,
        startDate:start,
        endDate:end,
        ranges:{
          'Hoy':[Moment(), Moment()],
          'Ayer':[
            Moment().subtract(1, 'days'),
            Moment().subtract(1, 'days'),
          ],
          'Ultimos 7 dias':[Moment().subtract(6, 'days'), Moment()],
          'Ultimos 15 dias':[Moment().subtract(14, 'days'), Moment()],
          'Ultimos 30 dias':[Moment().subtract(29, 'days'), Moment()],
          'Mes actual':[
            Moment().startOf('month'),
            Moment().endOf('month'),
          ],
          'Mes anterior':[
            Moment().subtract(1, 'month').startOf('month'),
            Moment().subtract(1, 'month').endOf('month'),
          ],
          'Hace 2 meses':[
            Moment().subtract(2, 'month').startOf('month'),
            Moment().subtract(2, 'month').endOf('month'),
          ],
        },
        locale:{
          cancelLabel:'Cancelar',
          applyLabel:'Aceptar',
          format:(isTimePicker) ? 'DD/MM/YYYY HH:mm:ss' : 'DD/MM/YYYY',
        },
        showDropdowns:true,
        autoUpdateInput:true,
      }
    }
  },
  secToTime(param_seconds){
    let sec_num = parseInt(param_seconds, 10),
    hh = Math.floor(sec_num / 3600),
    mm = Math.floor((sec_num - (hh * 3600)) / 60),
    ss = sec_num - (hh * 3600) - (mm * 60)
    if(hh < 10) hh = '0' + hh
    if(mm < 10) mm = '0' + mm
    if(ss < 10) ss = '0' + ss
    return hh + ':' + mm + ':' + ss
  },
  generateCharArray(param_charStart, param_charEnd){
    let alfabet = [],
    i = param_charStart.charCodeAt(0),
    j = param_charEnd.charCodeAt(0)
    for(; i <= j; ++i){
      alfabet.push(String.fromCharCode(i))
    }
    return alfabet
  },
  returnLetter(param_key, param_toUpper = false){
    const letters = this.generateCharArray('a', 'z')
    if(param_toUpper){
      return (letters[param_key]).toString().toUpperCase()
    }else{
      return letters[param_key]
    }
  },
  returnError(param_error){
    switch(param_error.response.status){
      case 500:
        return console.error(param_error) // Error de servidor
      case 401:
        return console.error(param_error) // Error de autenticacion
      case 412:
        return console.error(param_error) // Error de condiciones en la solicitud
    }
  },
  setCookie(param_name, param_value, param_daysExpired = 1){
    let d = new Date()
    d.setTime(d.getTime() + (param_daysExpired * 24 * 60 * 60 * 1000))
    let expires = 'expires=' + d.toUTCString()
    return document.cookie = param_name + '=' + JSON.stringify(param_value) + ';' + expires + ';path=/'
  },
  getCookie(param_name){
    let name = param_name + '='
    let decodedCookie = decodeURIComponent(document.cookie)
    let ca = decodedCookie.split(';')
    for(let i = 0; i < ca.length; i++){
      let c = ca[i]
      while(c.charAt(0) == ' '){c = c.substring(1)}
      if(c.indexOf(name) == 0){
        return JSON.parse(c.substring(name.length, c.length))
      }
    }
    return ''
  },
  removeCookie(param_name, param_path){
    return document.cookie = param_name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT; path=' + param_path
  },
  setStorage(param_name, param_value){
    return window.localStorage.setItem(param_name, param_value)
  },
  getStorage(param_name){
    return JSON.parse(window.localStorage.getItem(param_name))
  },
  removeStorage(param_name){
    return window.localStorage.removeItem(param_name)
  },
  generateHash(param_length = 16){
    const dec2hex = (dec)=>{
      return ('0' + dec.toString(16)).substr(-2)
    }
    let arr = new Uint8Array((param_length || 40) / 2)
    window.crypto.getRandomValues(arr)
    return Array.from(arr, dec2hex).join('')
  },
  handleFileUpload(self){
    let preview = self.$refs.html5_img,
    file = self.$refs.html5_file.files[0],
    reader = new FileReader()
    reader.onloadend = ()=>{
      preview.src = reader.result
    }
    if(file){
      return reader.readAsDataURL(file)
    }else{
      return preview.src = ''
    }
  },
}
