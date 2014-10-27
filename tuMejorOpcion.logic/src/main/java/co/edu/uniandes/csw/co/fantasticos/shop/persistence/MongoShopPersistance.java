/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.edu.uniandes.csw.co.fantasticos.shop.persistence;

import co.edu.uniandes.csw.co.fantasticos.client.persistence.ClientPersistence;
import co.edu.uniandes.csw.co.fantasticos.shop.logic.dto.ShopDTO;
import co.edu.uniandes.csw.co.fantasticos.shop.persistence.api.IShopPersistence;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.ServerAddress;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.enterprise.inject.Default;

/**
 *
 * @author Diego
 */
@Default
@Stateless 
@LocalBean
public class MongoShopPersistance implements IShopPersistence
{
    private DB db;
    
    public MongoShopPersistance() 
    {
        try 
        {
            MongoClient mongo = new MongoClient(new MongoClientURI("mongodb://diegomontoyas:diegomontoyas@ds047950.mongolab.com:47950/mongo"));
            db = mongo.getDB( "mongo" );
        } 
        catch (UnknownHostException ex) 
        {
            Logger.getLogger(ClientPersistence.class.getName()).log(Level.SEVERE, null, ex);
        }
    } 

    public ShopDTO createShop(ShopDTO detail) 
    {   
        DBCollection coll = db.getCollection("shops");
        
        BasicDBObject doc = new BasicDBObject(/*"id", detail.getId()*/)
        .append("name", detail.getName())
        .append("address", detail.getAddress());
        
        coll.insert(doc);
        
        return detail;
    }

    public List<ShopDTO> getShops() 
    {
        DBCollection coll = db.getCollection("shops");

        DBCursor cursor = coll.find();
        List<ShopDTO> shops = new ArrayList<ShopDTO>();
        
        try 
        {
            while(cursor.hasNext()) 
            {
                DBObject object = cursor.next();
                
                ShopDTO dto = new ShopDTO();
                dto.setId((Long) object.get("id"));
                dto.setName((String) object.get("name"));
                dto.setAddress((String) object.get("address"));
                
                shops.add(dto);
            }
            return shops;
        } 
        finally
        {
            cursor.close();
        }
    }

    public ShopDTO getShop(Long id) 
    {
        DBCollection coll = db.getCollection("shops");
        BasicDBObject query = new BasicDBObject("id", id);

        DBObject object = coll.findOne(query);
        
        ShopDTO dto = new ShopDTO();
        dto.setId((Long) object.get("id"));
        dto.setName((String) object.get("name"));
        dto.setAddress((String) object.get("address"));
        
        return dto;
    }

    public void deleteShop(Long id)
    {
        DBCollection coll = db.getCollection("shops");
        BasicDBObject query = new BasicDBObject("id", id);

        DBObject object = coll.findOne(query);
	coll.remove(object);
    }

    public void updateShop(ShopDTO detail)
    {
        throw new UnsupportedOperationException();
    }
    
}
