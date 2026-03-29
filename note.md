decorateur ne fait pas d'injection donc intercepteur

pour passer des appels exterieur
npm install --save @nestjs/axios axios

utilisations d'Api:https://docs.nestjs.com/techniques/http-module

https://edb-docs.up.railway.app/docs/exercise-service/intro

Site api: https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb/playground/apiendpoint_52361372-165c-4335-bb80-7873c68e647c

    //methode pour api
    async importAPi() {
    const options = {
        method: 'GET',
        url: 'https://exercisedb.p.rapidapi.com/exercises?limit=5',
        headers: {

            'X-RapidAPI-Key': '493558b012msh9bb9493828a9fb2p134977jsn3541546919f8',
            //nom de API
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        } 
    };

    //extraire mes donnée
    const { data } = await firstValueFrom(this.httpService.request(options));

    //boucler a travers chaque exo 
    for (const exo of data) {
    //mapping pour créer objet(exo)
        const course = this.repo.create({
            title: exo.name,
            description: `Entraînement ciblé : ${exo.target}. Zone : ${exo.bodyPart}.`,
            capacity: 15,
            gifUrl: exo.gifUrl,
            isActive: true
        });
    await this.repo.save(course);
    }
    //petit return de validation
    return { message: "5 cours importés avec succès !" };
  }