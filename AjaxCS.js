(function(baseWindow){
    var SettingPath="AjaxCS_setting.json";

    //check jquery
    if (baseWindow.jQuery) {  

    } else {
    //TODO: load web jquery
    console.log("JQuery not found");
    return;
    }



    class AjaxCS 
    {
        //this.window
        //this.SettingPath -> percorso del file di setting
        //this.Settings -> settaggi ( caricati dal json )
        constructor(baseWindow,SettingPath)
        {
            var _this=this;


            this.window=baseWindow;
            this.SettingPath = SettingPath;
            if(!isPathAbsolute(SettingPath))
            {
                //considero l'indirizzo relativo al path dello script
                var scripturl=$("script[src]").last().attr("src");
                var scriptpath = scripturl.split('?')[0].split('/').slice(0, -1).join('/')+'/';
                if(isPathAbsolute(scripturl))
                {
                    //se lo script è stato caricato con indirizzo assoluto
                    this.SettingPath=scriptpath+this.SettingPath;
                }
                else
                {
                    //se lo script è stato caricato con indirizzo relativo
                    if(scriptpath!="/")
                    {
                        this.SettingPath=scriptpath+this.SettingPath;
                    }
                }
            }       
            console.log("Setting path: "+this.SettingPath);
            
            
            this.LoadSetting(function(data)
            {
                _this.Settings=data;
                console.log(_this.Settings);
                _this.FireLoadedTrigger();
            });

        }


        LoadSetting(ContinueScript)
        {
              $.ajax({
                url: this.SettingPath,
                data: {},
                success:  function( data,status,xlr ) {
                    ContinueScript(data);
                  },
                  error:function( jqXHR,status,errorThrown  ) {
                    console.log(status);
                    console.log(errorThrown);
                  } 
              });
              
        }
        FireLoadedTrigger()
        {
            $(this.window.document).trigger( "AjaxCS_Loaded" );
        }



        /**
         * Invia un comando al server e ritorna la risposta
         * @param {String} Command  
         * @param {JSON} data 
         * @param {Function} callback function(data,message) -> dato di ritorno | messaggio 
         */
        Send(Command,data,callback)
        {
            var CallFunction;
            if( this.Settings.Method=="POST")
            {
                CallFunction=$.post;
            }
            else if( this.Settings.Method=="GET")
            {
                CallFunction=$.get;
            }
            else
            {
                console.log("Malformed 'Method' in "+this.SettingPath+"     can be only GET or POST ( case sensitive ) ");
                return;
            }

            CallFunction(this.Settings.PHP_url,{command:Command,data:data},function(data)
            {
                var json;
                try {
                    json = JSON.parse(data);
                } catch(e) {
                   //errore nel parse del json
                   callback(null,"JSON parse error");
                   return;
                }
                callback(json,"OK");
            });
        }

    }
    


    //Utility
    {
        
        function isPathAbsolute(path) {
            return /^(?:\/|[a-z]+:\/\/)/.test(path);
          }

    }

    baseWindow.AjaxCS = new AjaxCS(baseWindow,SettingPath);
})(window);