/**
 * Observa los elementos con clase .revelar y les agrega .es-visible
 * cuando entran en pantalla. Cubre también los elementos que aparecen
 * después de la carga inicial, como el mensaje de confirmación.
 */
export function useRevelar() {
  let observador: IntersectionObserver | null = null
  let mutaciones: MutationObserver | null = null

  onMounted(() => {
    const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!sinMovimiento && 'IntersectionObserver' in window) {
      observador = new IntersectionObserver(
        (entradas) => {
          entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
              entrada.target.classList.add('es-visible')
              observador?.unobserve(entrada.target)
            }
          })
        },
        { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
      )
    }

    const registrar = () => {
      document.querySelectorAll('.revelar:not(.es-visible)').forEach((el) => {
        if (observador) {
          observador.observe(el)
        } else {
          el.classList.add('es-visible')
        }
      })
    }

    registrar()

    mutaciones = new MutationObserver(registrar)
    mutaciones.observe(document.body, { childList: true, subtree: true })
  })

  onBeforeUnmount(() => {
    observador?.disconnect()
    mutaciones?.disconnect()
  })
}
