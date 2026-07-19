function A = get_A(a)
    a = a(:,2:end );% drop constant
    [n, tmp] = size(a);
    lags = tmp/n;
    A = zeros(n,n,lags);
    for lag = 1:lags
        a_index = 1 + (lag-1) * n;
        A(:,:,lag) = a(:,a_index: a_index+n-1);
    end
end