from django.conf import settings
from django.conf.urls import patterns, include, url
from django.conf.urls.static import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
	(r'^i18n/', include('django.conf.urls.i18n')),
	
	# Uncomment the next line to enable the admin:
	url(r'^admin/', include(admin.site.urls)),
	
	url(r'^$', 'pages.views.home', name='home'),
	url(r'^search/$', 'pages.views.search'),
	url(r'^author/(?P<author>.*)/deck/(?P<deck_slug>.*)/study/$', 'pages.views.study'),
	url(r'^author/(?P<author>.*)/deck/(?P<deck_slug>.*)/cards/$', 'pages.views.card_listing'),
	url(r'^author/(?P<author>.*)/deck/(?P<deck_slug>.*)/$', 'pages.views.launch'),

	# Uncomment the admin/doc line below to enable admin documentation:
	# url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
)

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += staticfiles_urlpatterns()