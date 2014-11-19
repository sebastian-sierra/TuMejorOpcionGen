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
  
  
  Source generated by CrudMaker version 1.0.0.201410261249*/

package co.edu.uniandes.csw.co.fantasticos.client.master.persistence.entity;

import co.edu.uniandes.csw.co.fantasticos.shop.persistence.entity.ShopEntity;
import co.edu.uniandes.csw.co.fantasticos.client.persistence.entity.ClientEntity;
import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.PrimaryKeyJoinColumn; 
import org.eclipse.persistence.annotations.JoinFetch;

@Entity
@IdClass(ClientshopsEntityId.class)
@NamedQueries({
    @NamedQuery(name = "ClientshopsEntity.getByMasterId", query = "SELECT  u FROM ClientshopsEntity u WHERE u.clientId=:clientId"),
    @NamedQuery(name = "ClientshopsEntity.deleteClientshopsEntity", query = "DELETE FROM ClientshopsEntity u WHERE u.clientId=:clientId and  u.shopsId=:shopsId")
})
public class ClientshopsEntity implements Serializable {

    @Id
    @Column(name = "clientId")
    private String clientId;
    @Id
    @Column(name = "shopsId")
    private Long shopsId;
    @ManyToOne
    @PrimaryKeyJoinColumn(name = "clientId", referencedColumnName = "id")
    @JoinFetch
    private ClientEntity clientIdEntity;
    @ManyToOne
    @PrimaryKeyJoinColumn(name = "shopsId", referencedColumnName = "id")
    @JoinFetch
    private ShopEntity shopsIdEntity; 

    public ClientshopsEntity() {
    }

    public ClientshopsEntity(String clientId, Long shopsId) {
        this.clientId =clientId;
        this.shopsId = shopsId;
    }

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public Long getShopsId() {
        return shopsId;
    }

    public void setShopsId(Long shopsId) {
        this.shopsId = shopsId;
    }

    public ClientEntity getClientIdEntity() {
        return clientIdEntity;
    }

    public void setClientIdEntity(ClientEntity clientIdEntity) {
        this.clientIdEntity = clientIdEntity;
    }

    public ShopEntity getShopsIdEntity() {
        return shopsIdEntity;
    }

    public void setShopsIdEntity(ShopEntity shopsIdEntity) {
        this.shopsIdEntity = shopsIdEntity;
    }

}