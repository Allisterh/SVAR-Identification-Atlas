function phi = get_phi(A, periods)
    [n,n,lags] = size(A);
    phi = zeros(n,n, periods);
    phi(:,:,1) =  eye(n);
    for period = 1:periods
        for j = 1:period-1
              if j<=lags
                    Aj = A(:,:,j);
              else
                    Aj = zeros(n,n);
              end
              phi(:,:,period)= phi(:,:,period) + Aj * phi(:,:,period-j);
        end

    end
end