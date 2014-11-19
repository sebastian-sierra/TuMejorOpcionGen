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

package co.edu.uniandes.csw.co.fantasticos.client.master.persistence;
import co.edu.uniandes.csw.co.fantasticos.giftcard.logic.dto.GiftCardDTO;
import co.edu.uniandes.csw.co.fantasticos.client.master.persistence.entity.ClientpurchasedGiftCardsEntity;
import co.edu.uniandes.csw.co.fantasticos.giftcard.persistence.converter.GiftCardConverter;
import co.edu.uniandes.csw.co.fantasticos.client.logic.dto.ClientDTO;
import co.edu.uniandes.csw.co.fantasticos.client.master.logic.dto.ClientMasterDTO;
import co.edu.uniandes.csw.co.fantasticos.client.master.persistence.api._IClientMasterPersistence;
import co.edu.uniandes.csw.co.fantasticos.client.master.persistence.entity.ClientshopsEntity;
import co.edu.uniandes.csw.co.fantasticos.client.persistence.api.IClientPersistence;
import co.edu.uniandes.csw.co.fantasticos.shop.logic.dto.ShopDTO;
import co.edu.uniandes.csw.co.fantasticos.shop.persistence.converter.ShopConverter;
import java.util.ArrayList;
import java.util.List;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

public class _ClientMasterPersistence implements _IClientMasterPersistence {

  	@PersistenceContext(unitName="tuMejorOpcionPU")
 
    protected EntityManager entityManager;
    
    @Inject
    protected IClientPersistence clientPersistence;  

    public ClientMasterDTO getClient(String clientId) {
        ClientMasterDTO clientMasterDTO = new ClientMasterDTO();
        ClientDTO client = clientPersistence.getClient(clientId);
        clientMasterDTO.setClientEntity(client);
        clientMasterDTO.setListpurchasedGiftCards(getClientpurchasedGiftCardsEntityList(clientId));
        clientMasterDTO.setListshops(getClientshopsEntityList(clientId));
        return clientMasterDTO;
    }

    public ClientpurchasedGiftCardsEntity createClientpurchasedGiftCardsEntity(ClientpurchasedGiftCardsEntity entity) {
        entityManager.persist(entity);
        return entity;
    }

    public void deleteClientpurchasedGiftCardsEntity(String clientId, Long purchasedGiftCardsId) {
        Query q = entityManager.createNamedQuery("ClientpurchasedGiftCardsEntity.deleteClientpurchasedGiftCardsEntity");
        q.setParameter("clientId", clientId);
        q.setParameter("purchasedGiftCardsId", purchasedGiftCardsId);
        q.executeUpdate();
    }

    public List<GiftCardDTO> getClientpurchasedGiftCardsEntityList(String clientId) {
        ArrayList<GiftCardDTO> resp = new ArrayList<GiftCardDTO>();
        Query q = entityManager.createNamedQuery("ClientpurchasedGiftCardsEntity.getByMasterId");
        q.setParameter("clientId",clientId);
        List<ClientpurchasedGiftCardsEntity> qResult =  q.getResultList();
        for (ClientpurchasedGiftCardsEntity entity : qResult) { 
            if(entity.getPurchasedGiftCardsIdEntity()==null){
                entityManager.refresh(entity);
            }
            resp.add(GiftCardConverter.entity2PersistenceDTO(entity.getPurchasedGiftCardsIdEntity()));
        }
        return resp;
    }
    
    public ClientshopsEntity createClientshopsEntity(ClientshopsEntity entity) {
        entityManager.persist(entity);
        return entity;
    }
    
    public void deleteClientshopsEntity(String clientId, Long shopsId) {
        Query q = entityManager.createNamedQuery("ClientshopsEntity.deleteClientshopsEntity");
        q.setParameter("clientId", clientId);
        q.setParameter("shopsId", shopsId);
        q.executeUpdate();
    }

    public List<ShopDTO> getClientshopsEntityList(String clientId) {
        ArrayList<ShopDTO> resp = new ArrayList<ShopDTO>();
        Query q = entityManager.createNamedQuery("ClientshopsEntity.getByMasterId");
        q.setParameter("clientId",clientId);
        List<ClientshopsEntity> qResult =  q.getResultList();
        for (ClientshopsEntity entity : qResult) { 
            if(entity.getShopsIdEntity()==null){
                entityManager.refresh(entity);
            }
            resp.add(ShopConverter.entity2PersistenceDTO(entity.getShopsIdEntity()));
        }
        return resp;
    }

}
