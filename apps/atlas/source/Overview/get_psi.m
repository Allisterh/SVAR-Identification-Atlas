function psi =get_psi(phi,B)
        psi = phi;
        [n, n, periods] = size(phi);
        for period = 1:periods
                psi(:,:,period) = phi(:,:,period)  * B;
        end
end