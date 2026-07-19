function plot_irf(phi, Y_names)
    [n, n, periods]  = size(phi);

    figure 
    counter = 1;
    for shock = 1:n
        for response = 1:n 
            subplot(n,n,counter) 
            plot( squeeze(phi(response,shock,:))    ) ;
            title(["Shock: ", Y_names{shock}, "  Response: ", Y_names{response}])
            counter = counter +1;
        end
    end
end