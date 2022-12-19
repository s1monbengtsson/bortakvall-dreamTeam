export interface IData {
  status: string,
  data: Array<IProduct>  
}

export interface IProduct {
      id: number,
      name: string,
      description: string,
      price: number,
      on_sale: boolean,
      images: {
        thumbnail: string,
        large: string,
      },
      stock_status: string,
      stock_quantity?: number,  
}



/* 
product api:et ger

object ->
status: string, data:array of objects
*/


/*

{
  "status": "success",
  "data": [
      {
          "id": 5216,
          "name": "Gott & Blandat Giants",
          "description": "<p>En mix av lakrits och gelé med fruktsmak</p>\n<p>Innehållsförteckning: Socker, glukossirap, glukos-fruktossirap, stärkelse, VETEMJÖL, melass, syra (citronsyra), fuktighetsbevarande medel (sorbitoler, glycerol), lakritsextrakt, salt, vegetabiliska oljor (kokos, palm), aromer, färgämnen (E153, E120, E100, E141), ytbehandlingsmedel (bivax), stabiliseringsmedel (E471).</p>\n<p><em>Alla priser är per skopa.</em></p>\n",
          "price": 12,
          "on_sale": false,
          "images": {
              "thumbnail": "/storage/products/thumbnails/1997509-300x300.png",
              "large": "/storage/products/1997509.png"
          },
          "stock_status": "instock",
          "stock_quantity": null
      }
  ]
}

*/