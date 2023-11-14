export class ApiService {
  baseUrl = "/";

  constructor(config){
    Object.assign(this, config);
  }
  setResource = (context, method) =>  {
    return this.baseUrl+`${context}/${method}`;
  }
  setHeaders = (context, method) =>  {
    let headers = {
        "Content-Type": "application/json"
    };
    if(method == 'uploadItem') headers = {}
    if(localStorage['x-sid']) headers['x-sid'] = localStorage['x-sid'];
    return headers;
  }

  post = async(context, method, params = {}) =>  {
    var self = this;
    let responseData = {};
    const resource = this.setResource(context, method);
    const headers = this.setHeaders(context, method);
    let data = JSON.stringify(params);
    if(method == 'uploadItem') data = params
    await fetch(resource, {
        method: 'POST', // or 'PUT'
        credentials: 'include',
        headers: headers,
        body: data,
        })
        .then((response) => {
            if(response.headers.get('x-sid')){
                localStorage.setItem('x-sid', response.headers.get('x-sid'))
            }
            return response.json()
        })
        .then((data) => {
            responseData = data;
        })
        .catch((error) => {
            responseData = error;
        });
    return responseData;
  }
}


export class Api extends ApiService{
    translator = {
        translate: (params) => {
            return this.post('predictor', 'get', params)
        }
    }
}
