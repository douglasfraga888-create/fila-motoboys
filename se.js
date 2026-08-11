/* =====================================================
   SERVICE WORKER
   PIZZARIA DI ROMA
   ===================================================== */


/* =====================================================
   INSTALAÇÃO
   ===================================================== */

self.addEventListener(
  "install",
  function(event) {

    self.skipWaiting();

  }
);


/* =====================================================
   ATIVAÇÃO
   ===================================================== */

self.addEventListener(
  "activate",
  function(event) {

    event.waitUntil(
      self.clients.claim()
    );

  }
);


/* =====================================================
   RECEBER PUSH

   Esta parte será usada na próxima etapa,
   quando conectarmos o Supabase.
   ===================================================== */

self.addEventListener(
  "push",
  function(event) {


    let dados = {

      title:
        "🛵 Pizzaria Di Roma",

      body:
        "Você foi chamado para uma entrega!",

      url:
        "/"

    };


    /*
      Se o servidor enviar informações,
      usa essas informações.
    */

    if (
      event.data
    ) {

      try {

        const recebidos =
          event.data.json();


        dados = {
          ...dados,
          ...recebidos
        };


      } catch (erro) {

        dados.body =
          event.data.text();

      }

    }


    const opcoes = {

      body:
        dados.body,

      icon:
        "/icon-192.png",

      badge:
        "/icon-192.png",

      vibrate:
        [
          200,
          100,
          200
        ],

      data: {

        url:
          dados.url || "/"

      }

    };


    event.waitUntil(

      self.registration
        .showNotification(
          dados.title,
          opcoes
        )

    );

  }
);


/* =====================================================
   CLICAR NA NOTIFICAÇÃO
   ===================================================== */

self.addEventListener(
  "notificationclick",
  function(event) {


    event.notification.close();


    const url =
      event.notification
        .data
        ?.url ||
      "/";


    event.waitUntil(

      clients.matchAll({
        type:
          "window",

        includeUncontrolled:
          true

      })
      .then(
        function(lista) {


          /*
            Se o site já estiver aberto,
            volta para aquela janela.
          */

          for (
            const cliente
            of lista
          ) {

            if (
              "focus"
              in cliente
            ) {

              cliente.navigate(
                url
              );

              return cliente.focus();

            }

          }


          /*
            Se não estiver aberto,
            abre uma nova janela.
          */

          if (
            clients.openWindow
          ) {

            return clients.openWindow(
              url
            );

          }

        }
      )

    );

  }
);
