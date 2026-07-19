function  rhs = get_rhs(Y,p)
    [T,n] = size(Y);
    rhs = ones(T,1);
    for lag = 1:p
        % Generate NaNs for values dropped due to lag
        drop = NaN(lag,n) ;
        % Append Y after NaNs
        Y_tmp = [drop; Y(1:end-lag,:)];
        % Add Y_tmp to rhs
        rhs = [rhs, Y_tmp];
    end
end