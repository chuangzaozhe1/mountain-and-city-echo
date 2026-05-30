import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/splash'
    },
    {
      path: '/splash',
      name: 'Splash',
      component: () => import('@/views/SplashView.vue')
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/story/:chapterId',
      name: 'Story',
      component: () => import('@/views/StoryView.vue')
    },
    {
      path: '/chapters',
      name: 'ChapterSelect',
      component: () => import('@/views/ChapterSelectView.vue')
    },
    {
      path: '/album',
      name: 'Album',
      component: () => import('@/views/AlbumView.vue')
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('@/views/SettingsView.vue')
    },
    {
      path: '/characters',
      name: 'CharacterGallery',
      component: () => import('@/views/CharacterGalleryView.vue')
    },
    {
      path: '/characters/:id',
      name: 'CharacterDetail',
      component: () => import('@/views/CharacterDetailView.vue')
    },
    {
      path: '/hiking',
      name: 'HikingMap',
      component: () => import('@/views/HikingMapView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue')
    }
  ]
})

export default router