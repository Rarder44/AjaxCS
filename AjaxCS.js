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



        //TODO:
        Cyclical=[];    //ID:"ID del ciclo di invio",command: "comando da invare",data:"dati da inviare",callback:"funzione di callback",time:"tempo dell'intervallo",intervalID:"Id dell'intervallo nel caso il ciclo sia in esecuzione"

        //createCiclicalSend (Command,data,callback,time,CustomID=null ) -> se il custom ID non viene passato, viene creato uno in automatico
        createCyclicalSend (Command,data,callback,time,CustomID=null ){

            if(this.GetCyclicalSendByID(CustomID)!=null)
                return CustomID;
            
            var tmp={};

            //genero l'ID o uso quello che mi è stato passato
            if(CustomID==null)
            {
                var ID;
                do
                {
                    ID= new Date().getTime();
                }
                while(this.GetCyclicalSendByID(ID)!=null);
                tmp["ID"]=ID;
            }
            else
            {
                tmp["ID"]=CustomID;
            }

            tmp["time"]=time;
            tmp["command"]=Command;
            tmp["data"]=data;
            tmp["callback"]=callback;
            tmp["intervalID"]=null;
            this.Cyclical.push(tmp); 
            return   tmp["ID"];      
        }
        deleteCyclicalSend (ID){
            var j=-1;
            for(var i=0;i<this.Cyclical.length;i++)
            {
                if(this.Cyclical[i].ID==ID)
                {
                    j=i;
                    break;
                }
            }
            if(j!=-1)
                this.Cyclical.splice(j,1);
        }
        GetCyclicalSendByID(ID)
        {
            for(var i=0;i<this.Cyclical.length;i++)
            {
                if(this.Cyclical[i].ID==ID)
                {
                    return this.Cyclical[i];
                }
            }
            return null;
        }

        StartCyclical (CyclicalID)
        {
            var cycl=this.GetCyclicalSendByID(CyclicalID);
            if(cycl==null)
                return;
            
            if(cycl["intervalID"]!=null)    //è già in esecuzione
                return;
            
            var _this=this;
            cycl["intervalID"] = setInterval(function(){ 
                _this.Send(cycl["command"],cycl["data"],cycl["callback"]);
            }, cycl["time"]);
        }
        StopCyclical (CyclicalID)
        {
            var cycl=this.GetCyclicalSendByID(CyclicalID);
            if(cycl==null)
                return;
            if(cycl["intervalID"]==null)    //non è in esecuzione
                return;

            clearInterval(cycl["intervalID"]);
            cycl["intervalID"] = null;
        }
        StopAllCyclical()
        {
            for(var i=0;i<this.Cyclical.length;i++)
                this.StopCyclical(this.Cyclical[i].ID);  
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