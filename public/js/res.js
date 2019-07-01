export default {
  appName: 'Olgard',
  appLogo: '/logo.jpg',
  sitemap: [
    { name: 'Galownea', id: 'main' },
    { name: 'Objavy', id: 'ads' },
    { name: 'Naviny', id: 'news' },
    { name: 'Calendar', id: 'calendar' },
    { name: 'Karta', id: 'geomap' },
    { name: 'Liudzi', id: 'people' }
  ],
  media_links: [
    { name: 'S13.ru', id: '//s13.ru' },
    { name: 'Forum', id: '//forum.grodno.net/' }
  ],
  news_form: [
    { id: 'subject', type: 'name', typeSpec: 'city' },
    { id: 'preview', type: 'text', typeSpec: 'unit' },
    { id: 'body', type: 'text', typeSpec: 'country' },
    { id: 'tags', type: 'enum', typeSpec: 'tags' }
  ],
  tags: [
    { name: 'Padzei', id: 'events' },
    { name: 'Gistorya', id: 'history' },
    { name: 'Zabavki', id: 'amazing' }
  ],
  AddNewRecordData: {
    error: { message: 'Add a new record' }
  }
};
