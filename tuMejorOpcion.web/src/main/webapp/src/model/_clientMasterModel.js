define([], function() {
    App.Model._ClientMasterModel = Backbone.Model.extend({
		initialize: function() {
            this.on('invalid', function(model,error) {
                Backbone.trigger('client-master-model-error', error);
            });
        },
        validate: function(attrs, options){
        	var modelMaster = new App.Model.ClientModel();
        	if(modelMaster.validate){
            	return modelMaster.validate(attrs.clientEntity,options);
            }
        }
    });

    App.Model._ClientMasterList = Backbone.Collection.extend({
        model: App.Model._ClientMasterModel,
        initialize: function() {
        }

    });
    return App.Model._ClientMasterModel;
    
});