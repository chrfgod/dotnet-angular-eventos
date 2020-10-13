using System.Threading.Tasks;
using ProAgil.Domain;

namespace ProAgil.Repository
{
    public interface IProAgilRepository
    {
         void Add<T>(T entity) where T : class;

         void Update<T>(T entity) where T : class;

         void Delete<T>(T entity) where T : class;

         Task<bool> SaveChangesAsync();

         //Eventos
         Task<Evento[]> GetAllEventosAsyncByTema(string tema, bool includePalestrantes);
         Task<Evento[]> GetAllEventosAsync(bool includePalestrantes);
         Task<Evento> GetEventoAsyncById(int EventoId, bool includePalestrantes);

         //Palestrantes
         Task<Palestrante[]> GetAllPalestrantesAsync(bool includeEventos);
         Task<Palestrante> GetPalestranteAsyncById(int PalestranteId, bool includeEventos);
         Task<Palestrante[]> GetAllPalestrantesAsyncByName(string nome, bool includeEventos);




    }
}