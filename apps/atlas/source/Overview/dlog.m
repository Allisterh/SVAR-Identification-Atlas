function dx = dlog(x, lag) 
        % Wachstumsraten berechnen
        dx =  log(x(lag+1:end))- log(x(1:end-lag));
        % NaNs für die ersten Werte generieren
        dropped = NaN(lag,1);
        % Zusammenfügen
        dx = [dropped; dx];
end 