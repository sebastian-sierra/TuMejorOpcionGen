define(['model/_clientMasterModel'], function() { 
    App.Model.ClientMasterModel = App.Model._ClientMasterModel.extend({

    });

    App.Model.ClientMasterList = App.Model._ClientMasterList.extend({
        model: App.Model.ClientMasterModel
    });

    return  App.Model.ClientMasterModel;

});