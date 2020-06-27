library(readxl)
library(magrittr)
library(tidyverse)
datos <- readxl::read_excel('10mo Semestre UPIITA/PTII/Proyecto-Terminal-2/Investigacion/Benchmark/ResultadosBenchmarkFinalV2.xlsx')
summary(datos)

# Análisis de datos de Apache Marmotta
apacheMarmotta <- datos %>% filter(TripleStore=='Apache Marmotta')
avgGeneral = apacheMarmotta %>% select(Tiempo) %>% unlist() %>% as.numeric() %>% mean()
sdGeneral = apacheMarmotta %>% select(Tiempo) %>% unlist() %>% as.numeric() %>% sd()

avgPorLimite = vector(length = 5)
sdPorLimite = vector(length = 5)
n = 1
for (limite in c(250,500,1000,2500,5000)){
  avgPorLimite[n] = apacheMarmotta %>%
                    filter(Limite == limite) %>%
                    select(Tiempo) %>% unlist() %>%
                    as.numeric() %>%
                    mean()
  sdPorLimite[n] = apacheMarmotta %>%
                   filter(Limite == limite) %>%
                   select(Tiempo) %>% unlist() %>%
                   as.numeric() %>% sd()
  n = n + 1
}

avgPorConsulta = vector(length = 6)
sdPorConsulta = vector(length = 6)
n = 1
for (consulta in c('Q1','Q2','Q3','Q4','Q5','Q6')){
  avgPorConsulta[n] = apacheMarmotta %>%
                      filter(Consulta == consulta) %>%
                      select(Tiempo) %>%
                      unlist() %>%
                      as.numeric() %>%
                      mean()
  sdPorConsulta[n] = apacheMarmotta %>%
                     filter(Consulta == consulta) %>%
                     select(Tiempo) %>%
                     unlist() %>%
                     as.numeric() %>%
                     sd()
  n = n + 1
}
