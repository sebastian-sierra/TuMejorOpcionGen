/* ========================================================================
   * Copyright 2014 co.fantasticos
   *
   * Licensed under the MIT, The MIT License (MIT)
   * Copyright (c) 2014 co.fantasticos
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
   * ========================================================================
  
  
  Source generated by CrudMaker version 1.0.0.201408112050*/
define(['model/shopModel'], function(shopModel) {
    App.Controller._ShopController = Backbone.View.extend({
        initialize: function(options) {
            this.modelClass = options.modelClass;
            this.listModelClass = options.listModelClass;
            this.showEdit = true;
            this.showDelete = true;
            this.editTemplate = _.template($('#shop').html());
            this.listTemplate = _.template($('#shopList').html());
            if (!options || !options.componentId) {
                this.componentId = _.random(0, 100) + "";
            }else{
				this.componentId = options.componentId;
		    }
            var self = this;
            if(self.postInit){
            	self.postInit(options);
            }
        },
        create: function() {
            if (App.Utils.eventExists(this.componentId + '-' +'instead-shop-create')) {
                Backbone.trigger(this.componentId + '-' + 'instead-shop-create', {view: this});
            } else {
                Backbone.trigger(this.componentId + '-' + 'pre-shop-create', {view: this});
                this.currentShopModel = new this.modelClass({componentId: this.componentId});
                this._renderEdit();
                Backbone.trigger(this.componentId + '-' + 'post-shop-create', {view: this});
            }
        },
        list: function(params) {
            if (params) {
                var data = params.data;
            }
            if (App.Utils.eventExists(this.componentId + '-' +'instead-shop-list')) {
                Backbone.trigger(this.componentId + '-' + 'instead-shop-list', {view: this, data: data});
            } else {
                Backbone.trigger(this.componentId + '-' + 'pre-shop-list', {view: this, data: data});
                var self = this;
				if(!this.shopModelList){
                 this.shopModelList = new this.listModelClass();
				}
                this.shopModelList.fetch({
                    data: data,
                    success: function() {
                        self._renderList();
                        Backbone.trigger(self.componentId + '-' + 'post-shop-list', {view: self});
                    },
                    error: function(mode, error) {
                        Backbone.trigger(self.componentId + '-' + 'error', {event: 'shop-list', view: self, error: error});
                    }
                });
            }
        },
        edit: function(params) {
            var id = params.id;
            var data = params.data;
            if (App.Utils.eventExists(this.componentId + '-' +'instead-shop-edit')) {
                Backbone.trigger(this.componentId + '-' + 'instead-shop-edit', {view: this, id: id, data: data});
            } else {
                Backbone.trigger(this.componentId + '-' + 'pre-shop-edit', {view: this, id: id, data: data});
                if (this.shopModelList) {
                    this.currentShopModel = this.shopModelList.get(id);
                    this.currentShopModel.set('componentId',this.componentId); 
                    this._renderEdit();
                    Backbone.trigger(this.componentId + '-' + 'post-shop-edit', {view: this, id: id, data: data});
                } else {
                    var self = this;
                    this.currentShopModel = new this.modelClass({id: id});
                    this.currentShopModel.fetch({
                        data: data,
                        success: function() {
                            self.currentShopModel.set('componentId',self.componentId); 
                            self._renderEdit();
                            Backbone.trigger(self.componentId + '-' + 'post-shop-edit', {view: this, id: id, data: data});
                        },
                        error: function() {
                            Backbone.trigger(self.componentId + '-' + 'error', {event: 'shop-edit', view: self, id: id, data: data, error: error});
                        }
                    });
                }
            }
        },
        destroy: function(params) {
            var id = params.id;
            var self = this;
            if (App.Utils.eventExists(this.componentId + '-' +'instead-shop-delete')) {
                Backbone.trigger(this.componentId + '-' + 'instead-shop-delete', {view: this, id: id});
            } else {
                Backbone.trigger(this.componentId + '-' + 'pre-shop-delete', {view: this, id: id});
                var deleteModel;
                if (this.shopModelList) {
                    deleteModel = this.shopModelList.get(id);
                } else {
                    deleteModel = new this.modelClass({id: id});
                }
                deleteModel.destroy({
                    success: function() {
                        Backbone.trigger(self.componentId + '-' + 'post-shop-delete', {view: self, model: deleteModel});
                    },
                    error: function() {
                        Backbone.trigger(self.componentId + '-' + 'error', {event: 'shop-delete', view: self, error: error});
                    }
                });
            }
        },
        save: function() {
            var self = this;
            var model = $('#' + this.componentId + '-shopForm').serializeObject();
            if (App.Utils.eventExists(this.componentId + '-' +'instead-shop-save')) {
                Backbone.trigger(this.componentId + '-' + 'instead-shop-save', {view: this, model : model});
            } else {
                Backbone.trigger(this.componentId + '-' + 'pre-shop-save', {view: this, model : model});
                this.currentShopModel.set(model);
                this.currentShopModel.save({},
                        {
                            success: function(model) {
                                Backbone.trigger(self.componentId + '-' + 'post-shop-save', {model: self.currentShopModel});
                            },
                            error: function(error) {
                                Backbone.trigger(self.componentId + '-' + 'error', {event: 'shop-save', view: self, error: error});
                            }
                        });
            }
        },
        _renderList: function() {
            var self = this;
            this.$el.slideUp("fast", function() {
                self.$el.html(self.listTemplate({shops: self.shopModelList.models, componentId: self.componentId, showEdit : self.showEdit , showDelete : self.showDelete}));
                self.$el.slideDown("fast");
            });
        },
        _renderEdit: function() {
            var self = this;
            this.$el.slideUp("fast", function() {
                self.$el.html(self.editTemplate({shop: self.currentShopModel, componentId: self.componentId , showEdit : self.showEdit , showDelete : self.showDelete
 
				}));
                self.$el.slideDown("fast");
            });
        }
    });
    return App.Controller._ShopController;
});