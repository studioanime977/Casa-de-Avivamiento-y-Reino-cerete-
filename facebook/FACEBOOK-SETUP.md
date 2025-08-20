# Configuración de Facebook API para Publicaciones Dinámicas

## 🎯 Objetivo
Esta guía te ayudará a configurar la integración dinámica con Facebook para mostrar automáticamente las publicaciones más recientes de tu página en tu sitio web.

## 📋 Requisitos Previos
- Página de Facebook: `Casa de Avivamiento y Reino Cerete`
- Cuenta de desarrollador de Facebook
- Aplicación de Facebook configurada

## 🔧 Pasos de Configuración

### 1. Crear una Aplicación de Facebook

1. Ve a [Facebook Developers](https://developers.facebook.com/)
2. Haz clic en "Mis Apps" → "Crear App"
3. Selecciona "Empresa" como tipo de aplicación
4. Completa la información:
   - **Nombre de la app**: `Casa de Avivamiento Web`
   - **Email de contacto**: `luismarkministerio@gmail.com`
   - **Propósito**: Mostrar contenido de página en sitio web

### 2. Configurar Permisos de la App

1. En el panel de la app, ve a "Configuración" → "Básica"
2. Agrega estos dominios:
   - **Dominios de la app**: Tu dominio web
   - **URL de política de privacidad**: Enlace a tu política de privacidad

### 3. Obtener Token de Acceso

#### Opción A: Graph API Explorer (Recomendado)
1. Ve a [Graph API Explorer](https://developers.facebook.com/tools/explorer)
2. Selecciona tu aplicación
3. En "Permisos", agrega:
   - `pages_show_list`
   - `pages_read_engagement` 
   - `pages_read_user_content`
4. Haz clic en "Generar Token de Acceso"
5. Copia el token generado

#### Opción B: Token de Página de Larga Duración
1. Obtén un token de usuario de corta duración
2. Intercámbialo por un token de página de larga duración usando:
```
https://graph.facebook.com/v18.0/oauth/access_token?
grant_type=fb_exchange_token&
client_id=TU_APP_ID&
client_secret=TU_APP_SECRET&
fb_exchange_token=TOKEN_CORTA_DURACION
```

### 4. Configurar en el Sitio Web

1. Ve a la página de publicaciones: `/facebook/facebook-posts.html`
2. La primera vez que cargue, verás un formulario de configuración
3. Pega tu token de acceso en el campo correspondiente
4. Haz clic en "Guardar y Cargar"

## 🎨 Características de la Integración

### ✅ Funcionalidades Implementadas
- **Sincronización automática** cada 5 minutos
- **Diferentes tipos de publicaciones**:
  - 📝 Publicaciones de texto
  - 🎥 Videos (reproducción directa)
  - 📸 Fotos y álbumes
  - 📅 Eventos
  - 🔗 Enlaces compartidos
- **Engagement real**: likes, comentarios, shares
- **Timestamps dinámicos**: "hace X horas/días"
- **Carga paginada**: botón "Cargar más"
- **Responsive design**

### 🔄 Actualización Automática
- Las publicaciones se actualizan automáticamente cada 5 minutos
- Botón manual de actualización disponible
- Almacenamiento local del token para persistencia

### 🎯 Tipos de Contenido Soportados
1. **Texto**: Mensajes con hashtags y enlaces automáticos
2. **Videos**: Reproductores embebidos de Facebook
3. **Fotos**: Imágenes en alta resolución
4. **Álbumes**: Indicador de múltiples fotos
5. **Enlaces**: Vista previa con imagen y descripción
6. **Eventos**: Tarjetas especiales con fecha y detalles

## 🔒 Seguridad y Privacidad

### Token de Acceso
- Se almacena localmente en el navegador
- No se envía a servidores externos
- Solo se usa para consultas de lectura

### Permisos Mínimos
- Solo lectura de contenido público
- No acceso a información privada
- No capacidad de publicar o modificar

## 🚀 Uso

### Primera Configuración
1. Abre `/facebook/facebook-posts.html`
2. Ingresa tu token de acceso
3. Las publicaciones se cargarán automáticamente

### Uso Diario
- Las publicaciones se actualizan automáticamente
- Los visitantes ven contenido siempre actualizado
- Videos se reproducen directamente en el sitio

## 🔧 Solución de Problemas

### Token Inválido o Expirado
- **Síntoma**: Error al cargar publicaciones
- **Solución**: Generar nuevo token en Graph API Explorer

### No se Muestran Videos
- **Síntoma**: Videos aparecen como enlaces
- **Solución**: Verificar permisos de la aplicación

### Carga Lenta
- **Síntoma**: Publicaciones tardan en cargar
- **Solución**: Normal en primera carga, mejora con el cache

## 📞 Soporte

Si necesitas ayuda con la configuración:
- **Email**: luismarkministerio@gmail.com
- **Facebook**: [Casa de Avivamiento y Reino Cerete](https://www.facebook.com/casadeavivamientoyreinocerete)

## 📝 Notas Técnicas

### Limitaciones de la API
- Máximo 100 publicaciones por consulta
- Rate limit de Facebook aplicable
- Algunas publicaciones privadas no aparecerán

### Compatibilidad
- Funciona en todos los navegadores modernos
- Responsive para móviles y tablets
- Compatible con Facebook SDK v18.0

---

¡Tu sitio web ahora mostrará automáticamente las publicaciones más recientes de Facebook! 🎉
