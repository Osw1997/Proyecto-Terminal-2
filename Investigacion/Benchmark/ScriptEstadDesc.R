library(readxl)
library(magrittr)
library(tidyverse)
datos <- readxl::read_excel('10mo Semestre UPIITA/PTII/Proyecto-Terminal-2/Investigacion/Benchmark/ResultadosBenchmarkFinalParliament.xlsx')
summary(datos)

# Análisis de datos de Apache Marmotta
apacheMarmotta <- datos %>% filter(TripleStore=='Parliament')
avgGeneral = apacheMarmotta %>% select(Tiempo) %>% unlist() %>% as.numeric() %>% mean(na.rm=T)
sdGeneral = apacheMarmotta %>% select(Tiempo) %>% unlist() %>% as.numeric() %>% sd(na.rm=T)

avgPorLimite = vector(length = 5)
sdPorLimite = vector(length = 5)
n = 1
for (limite in c(250,500,1000,2500,5000)){
  avgPorLimite[n] = apacheMarmotta %>%
                    filter(Limite == limite) %>%
                    select(Tiempo) %>% unlist() %>%
                    as.numeric() %>%
                    mean(na.rm=T)
  sdPorLimite[n] = apacheMarmotta %>%
                   filter(Limite == limite) %>%
                   select(Tiempo) %>% unlist() %>%
                   as.numeric() %>% sd(na.rm=T)
  n = n + 1
}

avgPorConsulta = vector(length = 10)
sdPorConsulta = vector(length = 10)
n = 1
for (consulta in c('Q1','Q2','Q3','Q4','Q5','Q6','Q7','Q8','Q9','Q10')){
  avgPorConsulta[n] = apacheMarmotta %>%
                      filter(Consulta == consulta) %>%
                      select(Tiempo) %>%
                      unlist() %>%
                      as.numeric() %>%
                      mean(na.rm=T)
  sdPorConsulta[n] = apacheMarmotta %>%
                     filter(Consulta == consulta) %>%
                     select(Tiempo) %>%
                     unlist() %>%
                     as.numeric() %>%
                     sd(na.rm=T)
  n = n + 1
}

avgGeneral
sdGeneral
avgPorLimite
sdPorLimite
avgPorConsulta
sdPorConsulta
