define(['controller/selectionController', 'model/cacheModel', 'model/clientMasterModel', 'component/_CRUDComponent', 'controller/tabController', 'component/clientComponent',
 'component/giftCardComponent'
 
 ],function(SelectionController, CacheModel, ClientMasterModel, CRUDComponent, TabController, ClientComponent,
 purchasedGiftCardsComponent
 ) {
    App.Component.ClientMasterComponent = App.Component.BasicComponent.extend({
        initialize: function() {
            var self = this;
            this.configuration = App.Utils.loadComponentConfiguration('clientMaster');
            var uComponent = new ClientComponent();
            uComponent.initialize();
            uComponent.render('main');
            Backbone.on(uComponent.componentId + '-post-client-create', function(params) {
                self.renderChilds(params);
            });
            Backbone.on(uComponent.componentId + '-post-client-edit', function(params) {
                self.renderChilds(params);
            });
            Backbone.on(uComponent.componentId + '-pre-client-list', function() {
                self.hideChilds();
            });
            Backbone.on('client-master-model-error', function(error) {
                Backbone.trigger(uComponent.componentId + '-' + 'error', {event: 'client-master-save', view: self, message: error});
            });
            Backbone.on(uComponent.componentId + '-instead-client-save', function(params) {
                self.model.set('clientEntity', params.model);
                if (params.model) {
                    self.model.set('id', params.model.id);
                } else {
                    self.model.unset('id');
                }
                var purchasedGiftCardsModels = self.purchasedGiftCardsComponent.componentController.giftCardModelList;
                self.model.set('listpurchasedGiftCards', []);
                self.model.set('createpurchasedGiftCards', []);
                self.model.set('updatepurchasedGiftCards', []);
                self.model.set('deletepurchasedGiftCards', []);
                for (var i = 0; i < purchasedGiftCardsModels.models.length; i++) {
                    var m =purchasedGiftCardsModels.models[i];
                    var modelCopy = m.clone();
                    if (m.isCreated()) {
                        //set the id to null
                        modelCopy.unset('id');
                        self.model.get('createpurchasedGiftCards').push(modelCopy.toJSON());
                    } else if (m.isUpdated()) {
                        self.model.get('updatepurchasedGiftCards').push(modelCopy.toJSON());
                    }
                }
                for (var i = 0; i < purchasedGiftCardsModels.deletedModels.length; i++) {
                    var m = purchasedGiftCardsModels.deletedModels[i];
                    self.model.get('deletepurchasedGiftCards').push(m.toJSON());
                }
                self.model.save({}, {
                    success: function() {
                        Backbone.trigger(uComponent.componentId + '-post-client-save', self);
                    },
                    error: function(error) {
                        Backbone.trigger(self.componentId + '-' + 'error', {event: 'client-master-save', view: self, error: error});
                    }
                });
            });
        },
        renderChilds: function(params) {
            var self = this;
            this.tabModel = new App.Model.TabModel(
                    {
                        tabs: [
                            {label: "Purchased Gift Cards", name: "purchasedGiftCards", enable: true},
                        ]
                    }
            );

            this.tabs = new TabController({model: this.tabModel});

            this.tabs.render('tabs');
            App.Model.ClientMasterModel.prototype.urlRoot = this.configuration.context;
            var options = {
                success: function() {
					self.purchasedGiftCardsComponent = new purchasedGiftCardsComponent();
                    self.purchasedGiftCardsModels = App.Utils.convertToModel(App.Utils.createCacheModel(App.Model.GiftCardModel), self.model.get('listpurchasedGiftCards'));
                    self.purchasedGiftCardsComponent.initialize({
                        modelClass: App.Utils.createCacheModel(App.Model.GiftCardModel),
                        listModelClass: App.Utils.createCacheList(App.Model.GiftCardModel, App.Model.GiftCardList, self.purchasedGiftCardsModels)
                    });
                    self.purchasedGiftCardsComponent.render(self.tabs.getTabHtmlId('purchasedGiftCards'));
                    Backbone.on(self.purchasedGiftCardsComponent.componentId + '-post-giftCard-create', function(params) {
                        params.view.currentGiftCardModel.setCacheList(params.view.giftCardModelList);
                    });
                    self.purchasedGiftCardsToolbarModel = self.purchasedGiftCardsComponent.toolbarModel.set(App.Utils.Constans.referenceToolbarConfiguration);
                    self.purchasedGiftCardsComponent.setToolbarModel(self.purchasedGiftCardsToolbarModel);                    
                	
                     
                
                    $('#tabs').show();
                },
                error: function() {
                    Backbone.trigger(self.componentId + '-' + 'error', {event: 'client-edit', view: self, id: id, data: data, error: error});
                }
            };
            if (params.id) {
                self.model = new App.Model.ClientMasterModel({id: params.id});
                self.model.fetch(options);
            } else {
                self.model = new App.Model.ClientMasterModel();
                options.success();
            }


        },
        hideChilds: function() {
            $('#tabs').hide();
        }
    });

    return App.Component.ClientMasterComponent;
});