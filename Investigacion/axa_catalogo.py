import requests
from bs4 import BeautifulSoup


url = "https://axa.mx/web/cotizador-autos/s?p_p_id=CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI&p_p_lifecycle=2&" \
      "p_p_state=normal&p_p_mode=view&p_p_cacheability=cacheLevelPage&p_p_col_id=column-1&p_p_col_count=2&" \
      "_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI__jsfBridgeAjax=true&" \
      "_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI__facesViewIdResource=%2Fviews%2FdatosCotizacion%2FdatosCotizacionView.xhtml"
headers = {
    'User-Agen': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:73.0) Gecko/20100101 Firefox/73.0',
    'Accept': '*/*',
    'Accept-Language': 'es-MX,es;q=0.8,en-US;q=0.5,en;q=0.3',
    'Faces-Request': 'partial/ajax',
    'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
    'Origin': 'https://axa.mx',
    'Connection': 'keep-alive',
    'Referer': 'https://axa.mx/web/cotizador-autos/?gclid=EAIaIQobChMI9pS_ltyi5wIVSr7ACh1GuQVbEAAYASAAEgIzfPD'
               '_BwE&gclsrc=aw.ds',
    'Cookie': 'JSESSIONID=0000mhc3rrDcwU1yH5hrFA_67sX:1brke4031; COOKIE_SUPPORT=true; GUEST_LANGUAGE_ID=es_ES;'
              ' TS012dfc8d=014731488af8a872ff3eca1aaee2aa850ba250b08baceeb48252dcad63a6aa00085311d3ff04371987bf1aa1f66f'
              '0328afa86e9c469209a45364b7847c77ce833a2aea1c2b92001994d3a0179fcb831ea5d2b285a08beea1f1948b24d8daf1d05c5'
              '05a4ec98dcbfa80a1ad31a1481b7891846be55bb1e806ac67b8cb06a3972d2cfa5492f5; ig_utm=utm_source=google&'
              'utm_content=EAIaIQobChMI9pS_ltyi5wIVSr7ACh1GuQVbEAAYASAAEgIzfPD_BwE; gclid=google-EAIaIQobChMI9pS_'
              'ltyi5wIVSr7ACh1GuQVbEAAYASAAEgIzfPD_BwE; _gcl_aw=GCL.1580091813.EAIaIQobChMI9pS_ltyi5wIVSr7ACh1GuQVbEAAY'
              'ASAAEgIzfPD_BwE; _gcl_dc=GCL.1580091813.EAIaIQobChMI9pS_ltyi5wIVSr7ACh1GuQVbEAAYASAAEgIzfPD_BwE;'
              ' _gcl_au=1.1.1574440189.1580091679; LFR_SESSION_STATE_10905=1580097216853; _'
              'ga=GA1.2.1920020418.1580091679; _gid=GA1.2.1589584516.1580091679; _gac_UA-130938608-1='
              '1.1580098069.EAIaIQobChMI9pS_ltyi5wIVSr7ACh1GuQVbEAAYASAAEgIzfPD_BwE; _fbp='
              'fb.1.1580091679476.565590286; uuid_claudia=1ea387d3-a0d1-4cb2-9c10-de4935215a52;'
              ' com.silverpop.iMAWebCookie=ead07170-5ca3-4e88-2699-063c3d793043; _gac_='
              '1.1580091816.EAIaIQobChMI9pS_ltyi5wIVSr7ACh1GuQVbEAAYASAAEgIzfPD_BwE; _gat_UA-130938608-1=1'
}
raw_data = '_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo' \
           '=_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo&javax.faces.encodedURL=https%3A' \
           '%2F%2Faxa.mx%2Fweb%2Fcotizador-autos%2Fs%3Fp_p_id%3DCotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI' \
           '%26p_p_lifecycle%3D2%26p_p_state%3Dnormal%26p_p_mode%3Dview%26p_p_cacheability%3DcacheLevelPage' \
           '%26p_p_col_id%3Dcolumn-1%26p_p_col_count%3D2' \
           '%26_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI__jsfBridgeAjax%3Dtrue' \
           '%26_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI__facesViewIdResource%3D%252Fviews' \
           '%252FdatosCotizacion%252FdatosCotizacionView.xhtml&_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_' \
           '%3AdatosVehiculo%3AlinkCar=AUTO&_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo' \
           '%3AlinkPickup=PICK%20UP&_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo%3Aplate' \
           '=&_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo%3Adescripcion' \
           '=&_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo%3Amarca' \
           '=&_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo%3Amodelo' \
           '=&_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo%3Aanio' \
           '=&_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo%3AdescripcionFull' \
           '=&_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo%3AinputDia' \
           '=&_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo%3AinputMes' \
           '=&_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo%3AinputAnio' \
           '=&_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo%3Acp' \
           '=&_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo%3Anombre' \
           '=&_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo%3AaPaterno' \
           '=&_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo%3AaMaterno' \
           '=&_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo%3Acorreo' \
           '=&_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo%3Atelefono' \
           '=&_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo%3AcodigoPromocion=&g-recaptcha' \
           '-response=&_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo%3ArecaptchaHidden' \
           '=03AOLTBLQFF2kQILoVw7W3Er-7yIKiG7Snbnk57ecKtKFnL-CX2Rb1Iesx' \
           '-QnOhhmiMztlydnDnP0ygUqmqBvSqG9kmEaxUW50aqmARGITeHMoIDa4kC20hJX7pzm_LaL8QFiq_t7778LhwSc912BOpWP85PBRPmXY' \
           'ho35s7QE94Dx1ccymNbhJlpC0viHEzQUUk7w8DCLSFvG4lspL5B9NBszAt0CZMsd99X2zJ99o4tGZ86qoSJKUdzCmHlnC_z-X9IzHq5V' \
           'h_jBOMCCTtC75jV6rBgLjkAtT5CWzKdLIqwJlB5zjT6lMFcGBbp_qW04RiZXEo1-iJwcbvarsyGSGDs19kFdFhb8wiQc_YNmMIrLFoJJ' \
           'Ij_ni9elyvNEJ1-1bvEyk1rNKrsR_ZwmcDqHllEGYwvvVz0UosbkOt_6zdHWd6wXZ8M5EJ_KKhsAWgeQq0j2lzf6JKhm13BcFICDwmvQ' \
           'mEqy5YuC1XPQqb8C-bvIueE4B4E5jM5bavALRBH17uWYlrlqgnB4&_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSV' \
           'PI_%3AdatosVehiculo%3AavisoPrivacidad=on&_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosV' \
           'ehiculo%3AavisoPriv=on&javax.faces.ViewState=-6482303946233533482%3A967177784219873779&javax.faces.sourc' \
           'e=_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo%3AnsSearchNormal&javax.faces.pa' \
           'rtial.event=click&javax.faces.partial.execute=_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3Ad' \
           'atosVehiculo%3AnsSearchNormal%20_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo%3' \
           'AnsSearchNormal&javax.faces.partial.render=_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3Adato' \
           'sVehiculo%3ApanelTypeCot%20_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo%3Apane' \
           'lContentTypeCot&javax.faces.behavior.event=action&javax.faces.partial.ajax=true '

# # Se solicitan las marcas
# marcas_requ = requests.post(url=url, headers=headers, data=raw_data)
# marcas_soup = BeautifulSoup(marcas_requ.text, features='lxml')
# marcas_html = marcas_soup.find_all('option')
#
# # Se obtienen las marcas y sus respectivas claves
# marcas_name = [option.text for option in marcas_html if option.text]
# marcas_keys = [option['value'] for option in marcas_html if option['value']]



# print(len(marcas_keys))
# print(marcas_keys)
# print(len(marcas_name))
# print(marcas_name)


raw_data_1 = '_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo=_CotizadorAutosVPIBancs_WAR_LR_AXA' \
           '_COT	IZADOR_AUTOSVPI_%3AdatosVehiculo&javax.faces.encodedURL=https%3A%2F%2Faxa.mx%2Fweb%' \
           '2Fcotizador-autos%2Fs%3Fp_p_id%3DCotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI%26p_p_lifecycle%' \
           '3D2%26p_p_state%3Dnormal%26p_p_mode%3Dview%26p_p_cacheability%3DcacheLevelPage%26p_p_col_id%3Dcolumn-1%' \
           '26p_p_col_count%3D2%26_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI__jsfBridgeAjax%3Dtrue%' \
           '26_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI__facesViewIdResource%3D%252Fviews%252F' \
           'datosCotizacion%252FdatosCotizacionView.xhtml&_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%' \
           '3AdatosVehiculo%3AlinkCar=AUTO&_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo%' \
           '3AlinkPickup=PICK%20UP&_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo%3Aplate=' \
           '&_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo%3Adescripcion=&_CotizadorAutos' \
           'VPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo%3Amarca='
brand_auto = 'CH'
raw_data_2 = '&_CotizadorAutosVPIBancs_WAR_LR_AXA_' \
           'COTIZADOR_AUTOSVPI_%3AdatosVehiculo%3Amodelo=&_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%' \
           '3AdatosVehiculo%3Aanio=&_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo%' \
           '3AdescripcionFull=&_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo%3AinputDia=' \
           '&_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo%3AinputMes=&_CotizadorAutos' \
           'VPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo%3AinputAnio=&_CotizadorAutosVPIBancs_WAR_LR_AXA' \
           '_COTIZADOR_AUTOSVPI_%3AdatosVehiculo%3Acp=&_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%' \
           '3AdatosVehiculo%3Anombre=&_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo%3Aa' \
           'Paterno=&_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo%3AaMaterno=&_Cotizador' \
           'AutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo%3Acorreo=&_CotizadorAutosVPIBancs_WAR_LR_' \
           'AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo%3Atelefono=&_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI' \
           '_%3AdatosVehiculo%3AcodigoPromocion=&g-recaptcha-response=&_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_' \
           'AUTOSVPI_%3AdatosVehiculo%3ArecaptchaHidden=03AOLTBLQFF2kQILoVw7W3Er-7yIKiG7Snbnk57ecKtKFnL-CX2Rb1Iesx-' \
           'QnOhhmiMztlydnDnP0ygUqmqBvSqG9kmEaxUW50aqmARGITeHMoIDa4kC20hJX7pzm_LaL8QFiq_t7778LhwSc912BOpWP85PBRPmXY' \
           'ho35s7QE94Dx1ccymNbhJlpC0viHEzQUUk7w8DCLSFvG4lspL5B9NBszAt0CZMsd99X2zJ99o4tGZ86qoSJKUdzCmHlnC_z-X9IzHq5Vh' \
           '_jBOMCCTtC75jV6rBgLjkAtT5CWzKdLIqwJlB5zjT6lMFcGBbp_qW04RiZXEo1-iJwcbvarsyGSGDs19kFdFhb8wiQc_YNmMIrLFo' \
           'JJIj_ni9elyvNEJ1-1bvEyk1rNKrsR_ZwmcDqHllEGYwvvVz0UosbkOt_6zdHWd6wXZ8M5EJ_KKhsAWgeQq0j2lzf6JKhm13BcFICDwmv' \
           'QmEqy5YuC1XPQqb8C-bvIueE4B4E5jM5bavALRBH17uWYlrlqgnB4&_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOS' \
           'VPI_%3AdatosVehiculo%3AavisoPrivacidad=on&_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3Adatos' \
           'Vehiculo%3AavisoPriv=on&javax.faces.ViewState=-181665655605877943%3A379466550024182792&javax.faces.source' \
           '=_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo%3Amarca&javax.faces.partial.' \
           'event=change&javax.faces.partial.execute=_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3Adatos' \
           'Vehiculo%3Amarca&javax.faces.partial.render=_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3A' \
           'datosVehiculo%3AmessageDescripcion%20_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3Adatos' \
           'Vehiculo%3AmessageAnio%20_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo%3A' \
           'messageMarca%20_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo%3Amarca%20_' \
           'CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo%3Aanio%20_CotizadorAutosVPI' \
           'Bancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_%3AdatosVehiculo%3Amodelo%20_CotizadorAutosVPIBancs_WAR_LR_AXA_' \
           'COTIZADOR_AUTOSVPI_%3AdatosVehiculo%3Adescripcion&javax.faces.behavior.event=valueChange&javax.faces.' \
           'partial.ajax=true'

raw_data = raw_data_1 + brand_auto + raw_data_2

modelos_requ = requests.post(url=url, headers=headers, data=raw_data)
modelos_soup = BeautifulSoup(modelos_requ.text, features='lxml')

# Se extrae el 'update' cuyo id es '_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_:datosVehiculo:messageMarca'
modelos_html = modelos_soup.find('update', {"id": '_CotizadorAutosVPIBancs_WAR_LR_AXA_COTIZADOR_AUTOSVPI_:datosVehiculo:modelo'})

# Luego se extren los modelos y sus respectivas marcas
modelos_html = modelos_html.find_all('option')
modelos_name = [option.text for option in modelos_html if option.text]
modelos_keys = [option['value'] for option in modelos_html if option['value']]
# print(len(modelos_name))
# print(modelos_name)
# print(len(modelos_keys))
# print(modelos_keys)